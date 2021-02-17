import {useContext, useEffect, useState} from 'react';
import catchify from 'catchify';
import qs from 'qs';

import { Route } from './withAPI';
import {AuthContext} from '../Auth';

const withPagination = (Component: (props: any) => JSX.Element, route: Route) => (props: any) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      throw new Error();
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const { page } = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    const offset = parseInt(page as string || '0', 10) * 25;

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

    catchify(
      fetch(`https://abbot-api-auevpolm5q-uc.a.run.app/${routeUrl}?offset=${offset}`, opts).then((d) => d.json()),
    ).then(([err, res]: [any | null, any | null]) => {
      setData(res);
      setLoading(false);
    });
  }, [user, props]);

  return <Component {...props} loading={loading} data={data} />;
};

export default withPagination;
