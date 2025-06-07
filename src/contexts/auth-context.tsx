import React from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  userType: null,
  isLoading: true,
  login: async () => false,
  logout: () => {}
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [userType, setUserType] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Check for stored auth on mount
  React.useEffect(() => {
    const checkAuth = () => {
      try {
        const storedAuth = localStorage.getItem('isAuthenticated');
        const storedUserType = localStorage.getItem('userType');
        
        if (storedAuth === 'true' && storedUserType) {
          setIsAuthenticated(true);
          setUserType(storedUserType);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        // Always set loading to false, even if there's an error
        setIsLoading(false);
      }
    };
    
    // Small timeout to ensure localStorage is available
    setTimeout(checkAuth, 100);
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, use hardcoded values
      if (password === '123456') {
        if (username === 'student') {
          setUserType('student');
          setIsAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userType', 'student');
          return true;
        } else if (username === 'teacher') {
          setUserType('teacher');
          setIsAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userType', 'teacher');
          return true;
        } else if (username === 'admin') {
          setUserType('admin');
          setIsAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userType', 'admin');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    try {
      setIsAuthenticated(false);
      setUserType(null);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userType');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const contextValue = {
    isAuthenticated,
    userType,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);