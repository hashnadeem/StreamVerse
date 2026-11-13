import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUBSCRIPTION_PLANS } from '../data/subscriptionPlans';

const AuthContext = createContext(null);

const STORAGE_USERS_KEY = 'streamverse_users_v1';
const STORAGE_SESSION_KEY = 'streamverse_session_v1';

const DEFAULT_USERS = [
  {
    id: 'u-admin-1',
    name: 'Haris Hassaan',
    email: 'harishassaan2004@gmail.com',
    password: 'password123',
    role: 'admin',
    status: 'active',
    subscriptionPlan: 'premium',
    profiles: [
      {
        id: 'prof-haris',
        name: 'Haris',
        avatarColor: '#e50914',
        avatarIcon: '🎬',
        isKids: false,
        myList: ['sv-101', 'sv-105'],
        continueWatching: [
          {
            titleId: 'sv-101',
            episodeId: 'ep-101-1',
            progressSeconds: 1420,
            durationSeconds: 3120,
            updatedAt: '2026-11-07T21:15:00Z',
          },
        ],
      },
      {
        id: 'prof-hashir-co',
        name: 'Hashir',
        avatarColor: '#3b82f6',
        avatarIcon: '🚀',
        isKids: false,
        myList: ['sv-102'],
        continueWatching: [],
      },
      {
        id: 'prof-kids',
        name: 'Kids Zone',
        avatarColor: '#00b4d8',
        avatarIcon: '🌟',
        isKids: true,
        myList: ['sv-103', 'sv-104'],
        continueWatching: [],
      },
    ],
  },
  {
    id: 'u-user-2',
    name: 'Hashir Nadeem',
    email: 'nadeemhashir53@gmail.com',
    password: 'password123',
    role: 'user',
    status: 'active',
    subscriptionPlan: 'standard',
    profiles: [
      {
        id: 'prof-hashir-main',
        name: 'Hashir',
        avatarColor: '#e50914',
        avatarIcon: '🎮',
        isKids: false,
        myList: ['sv-101', 'sv-109'],
        continueWatching: [
          {
            titleId: 'sv-102',
            episodeId: null,
            progressSeconds: 2600,
            durationSeconds: 7800,
            updatedAt: '2026-11-07T19:40:00Z',
          },
        ],
      },
      {
        id: 'prof-kids-2',
        name: 'Junior',
        avatarColor: '#10b981',
        avatarIcon: '🧸',
        isKids: true,
        myList: ['sv-103'],
        continueWatching: [],
      },
    ],
  },
];

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_USERS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem(STORAGE_SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  }, [session]);

  const currentUser = session
    ? users.find((u) => u.id === session.userId) || null
    : null;

  const activeProfile =
    currentUser && session?.profileId
      ? currentUser.profiles.find((p) => p.id === session.profileId) ||
        currentUser.profiles[0] ||
        null
      : null;

  const currentPlanDetails =
    SUBSCRIPTION_PLANS.find((p) => p.id === (currentUser?.subscriptionPlan || 'standard')) ||
    SUBSCRIPTION_PLANS[1];

  const login = (email, password) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!found) {
      throw new Error('Invalid email or password.');
    }
    if (found.status === 'suspended') {
      throw new Error('This account has been suspended by an administrator.');
    }
    const token = `jwt-sim-${found.id}-${Date.now()}`;
    setSession({
      token,
      userId: found.id,
      profileId: found.profiles[0]?.id || null,
    });
    return found;
  };

  const signup = ({ name, email, password, role = 'user', subscriptionPlan = 'standard' }) => {
    const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      throw new Error('An account with this email already exists.');
    }
    const firstProfileId = `prof-${Date.now()}`;
    const newUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      status: 'active',
      subscriptionPlan,
      profiles: [
        {
          id: firstProfileId,
          name: name.trim().split(' ')[0] || 'Main',
          avatarColor: '#e50914',
          avatarIcon: '🎬',
          isKids: false,
          myList: [],
          continueWatching: [],
        },
      ],
    };

    setUsers((prev) => [...prev, newUser]);
    setSession({
      token: `jwt-sim-${newUser.id}-${Date.now()}`,
      userId: newUser.id,
      profileId: firstProfileId,
    });
    return newUser;
  };

  const logout = () => {
    setSession(null);
  };

  const selectProfile = (profileId) => {
    if (!currentUser) return;
    setSession((prev) => ({ ...prev, profileId }));
  };

  const addProfile = ({ name, avatarColor, avatarIcon, isKids }) => {
    if (!currentUser) return;
    const maxAllowed = currentPlanDetails.maxProfiles;
    if (currentUser.profiles.length >= maxAllowed) {
      throw new Error(
        `Your ${currentPlanDetails.name} plan allows up to ${maxAllowed} profile(s). Upgrade your plan to add more.`
      );
    }
    const newProfile = {
      id: `prof-${Date.now()}`,
      name: name.trim(),
      avatarColor: avatarColor || '#e50914',
      avatarIcon: avatarIcon || (isKids ? '🌟' : '🎬'),
      isKids: Boolean(isKids),
      myList: [],
      continueWatching: [],
    };
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id ? { ...u, profiles: [...u.profiles, newProfile] } : u
      )
    );
    return newProfile;
  };

  const deleteProfile = (profileId) => {
    if (!currentUser || currentUser.profiles.length <= 1) {
      throw new Error('You must keep at least one profile on your account.');
    }
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser.id) return u;
        const remaining = u.profiles.filter((p) => p.id !== profileId);
        return { ...u, profiles: remaining };
      })
    );
    if (session?.profileId === profileId) {
      const fallback = currentUser.profiles.find((p) => p.id !== profileId);
      setSession((prev) => ({ ...prev, profileId: fallback?.id || null }));
    }
  };

  const updateSubscriptionPlan = (planId) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, subscriptionPlan: planId } : u))
    );
  };

  const toggleMyList = (titleId) => {
    if (!currentUser || !activeProfile) return;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser.id) return u;
        return {
          ...u,
          profiles: u.profiles.map((p) => {
            if (p.id !== activeProfile.id) return p;
            const exists = p.myList.includes(titleId);
            return {
              ...p,
              myList: exists
                ? p.myList.filter((id) => id !== titleId)
                : [...p.myList, titleId],
            };
          }),
        };
      })
    );
  };

  const saveWatchProgress = (titleId, progressSeconds, durationSeconds, episodeId = null) => {
    if (!currentUser || !activeProfile) return;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser.id) return u;
        return {
          ...u,
          profiles: u.profiles.map((p) => {
            if (p.id !== activeProfile.id) return p;
            const filtered = p.continueWatching.filter((item) => item.titleId !== titleId);
            const updatedEntry = {
              titleId,
              episodeId,
              progressSeconds: Math.round(progressSeconds),
              durationSeconds: Math.round(durationSeconds || 100),
              updatedAt: new Date().toISOString(),
            };
            return {
              ...p,
              continueWatching: [updatedEntry, ...filtered],
            };
          }),
        };
      })
    );
  };

  const toggleUserRole = (targetUserId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === targetUserId
          ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' }
          : u
      )
    );
  };

  const toggleUserStatus = (targetUserId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === targetUserId
          ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' }
          : u
      )
    );
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        activeProfile,
        currentPlanDetails,
        isAuthenticated: Boolean(currentUser),
        isAdmin: currentUser?.role === 'admin',
        login,
        signup,
        logout,
        selectProfile,
        addProfile,
        deleteProfile,
        updateSubscriptionPlan,
        toggleMyList,
        saveWatchProgress,
        toggleUserRole,
        toggleUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

