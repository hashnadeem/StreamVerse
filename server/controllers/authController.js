import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'streamverse-bds7a-jwt-secret-key';

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'user', subscriptionPlan = 'standard' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role,
      subscriptionPlan,
      profiles: [
        {
          name: name.split(' ')[0] || 'Main',
          avatarColor: '#e50914',
          avatarIcon: '🎬',
          isKids: false,
          myList: [],
          continueWatching: [],
        },
        {
          name: 'Kids',
          avatarColor: '#00b4d8',
          avatarIcon: '🌟',
          isKids: true,
          myList: [],
          continueWatching: [],
        },
      ],
    });

    const token = signToken(newUser);
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        subscriptionPlan: newUser.subscriptionPlan,
        profiles: newUser.profiles,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        profiles: user.profiles,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();
    res.json({ id: user._id, role: user.role, message: `Role updated to ${user.role}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role', error: error.message });
  }
};

export const addProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.profiles.length >= 4) {
      return res.status(400).json({ message: 'Maximum 4 profiles reached for this account.' });
    }

    const { name, avatarColor, avatarIcon, isKids } = req.body;
    const newProfile = {
      name: name.trim(),
      avatarColor: avatarColor || '#e50914',
      avatarIcon: avatarIcon || (isKids ? '🌟' : '🎬'),
      isKids: Boolean(isKids),
      myList: [],
      continueWatching: [],
    };

    user.profiles.push(newProfile);
    await user.save();
    res.status(201).json(user.profiles);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add profile', error: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.profiles.length <= 1) {
      return res.status(400).json({ message: 'Accounts must keep at least 1 viewing profile.' });
    }

    user.profiles = user.profiles.filter((p) => String(p._id) !== profileId);
    await user.save();
    res.json(user.profiles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete profile', error: error.message });
  }
};

export const toggleWatchlist = async (req, res) => {
  try {
    const { profileId, titleId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = user.profiles.id(profileId) || user.profiles[0];
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const exists = profile.myList.includes(titleId);
    if (exists) {
      profile.myList = profile.myList.filter((id) => id !== titleId);
    } else {
      profile.myList.push(titleId);
    }

    await user.save();
    res.json({ myList: profile.myList, added: !exists });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle watchlist in MongoDB', error: error.message });
  }
};

export const saveWatchProgress = async (req, res) => {
  try {
    const { profileId, titleId, episodeId, progressSeconds, durationSeconds } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = user.profiles.id(profileId) || user.profiles[0];
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.continueWatching = profile.continueWatching.filter(
      (item) => item.titleId !== titleId
    );
    profile.continueWatching.unshift({
      titleId,
      episodeId: episodeId || null,
      progressSeconds: Math.round(progressSeconds || 0),
      durationSeconds: Math.round(durationSeconds || 100),
      updatedAt: new Date(),
    });

    await user.save();
    res.json(profile.continueWatching);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save progress in MongoDB', error: error.message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const { planId } = req.body;
    if (!['basic', 'standard', 'premium'].includes(planId)) {
      return res.status(400).json({ message: 'Invalid subscription plan ID' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { subscriptionPlan: planId },
      { new: true }
    ).select('-passwordHash');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update subscription', error: error.message });
  }
};
