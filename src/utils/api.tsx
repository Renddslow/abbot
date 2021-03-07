import { useContext, useState, useEffect } from 'react';
import catchify from 'catchify';

import { AuthContext, User } from '../Auth';

export type Route = {
  route: string | ((props: any) => string);
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: Record<string, any>;
};

export const get = (route: string, opts: Record<string, any>, user: User, signal: any) => {
  const options = {
    ...opts,
    method: 'GET',
    headers: {
      ...opts.headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
      signal,
    },
  };

  return catchify(
    fetch(`https://abbot-api-auevpolm5q-uc.a.run.app/${route}`, options).then((d) => d.json()),
  );
};

const withApi = (Component: (props: any) => JSX.Element, route: Route) => (props: any) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  if (!user) {
    throw new Error();
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const routeUrl = typeof route.route === 'function' ? route.route(props) : route.route;

    get(routeUrl, {}, user, signal).then(([err, res]: [any | null, any | null]) => {
      setData(res);
      setLoading(false);
    });

    return () => controller.abort();
  }, [user, props]);

  return <Component {...props} data={data} loading={loading} />;
};

export default withApi;
