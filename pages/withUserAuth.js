import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const withUserAuth = (WrappedComponent) => {
  const WithUserAuth = (props) => {
    const [isUser,setIsUser] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      let isComponentMounted = true;

      async function checkAdminStatus() {
        try {
          const token = sessionStorage.getItem('token');
          if (token) {
            const response = await axios.get(`${apiUrl}/api/v1/users/current`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (isComponentMounted) {
              if (response) {
                setIsUser(true);
               
              } else {
                router.push('/unauthorized');
              }
            }
          } else {
            if (isComponentMounted) {
              router.push('/login');
            }
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          if (isComponentMounted) {
            router.push('/error');
          }
        } finally {
          if (isComponentMounted) {
            setIsLoading(false);
          }
        }
      }

      checkAdminStatus();

      // Cleanup function
      return () => {
        isComponentMounted = false;
      };
    }, [router]);

    if (isLoading) {
      return <div>Loading...</div>; // Loading indicator
    }

    if (!isUser) {
      return null; // Don't render anything if not admin
    }

    return <WrappedComponent {...props} />;
  };

  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithUserAuth.displayName = `WithUserAuth(${wrappedComponentName})`;

  return WithUserAuth;
};

export default withUserAuth;
