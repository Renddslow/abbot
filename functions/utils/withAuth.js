const withAuth = (cb, permission) => (parent, args, ctx) => {
  if (!ctx.auth || !ctx.auth.canStillUseApp) {
    throw new Error('InsufficientPermissionError');
  }

  const hasSpecifiedPermission = permission
    ? ctx.auth.permissions.filter(({ name, allowed }) => name === permission && allowed).length
    : true;

  if (!hasSpecifiedPermission) {
    throw new Error('InsufficientPermissionError');
  }

  return cb(parent, args, ctx);
};

module.exports = withAuth;
