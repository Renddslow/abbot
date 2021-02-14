import { useContext, useState, useEffect } from 'react';
import catchify from 'catchify';

import { AuthContext } from '../Auth';

export type Route = {
  route: string | ((props: any) => void);
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: Record<string, any>,
};

const withAPI = (Component: (props: any) => JSX.Element, route: Route) => (props: any) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  if (!user) {
    throw new Error();
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const opts: Record<string, any> = {
      method: route.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
        signal,
      },
    };

    if (['POST', 'PATCH'].includes(route.method) && route.body) {
      opts.body = route.body;
    }

    const routeUrl = typeof route.route === 'function' ? route.route(props) : route.route;

    catchify(fetch(`https://abbot-api-auevpolm5q-uc.a.run.app/${routeUrl}`, opts).then((d) => d.json()))
      .then(([err, res]: [any | null, any | null]) => {
        setData(res);
        setLoading(false);
      });

    return () => controller.abort();
  }, [user.token, props]);

  return (<Component {...props} data={data} loading={loading} />);
};

export default withAPI;
