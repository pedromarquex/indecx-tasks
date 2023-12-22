db.createUser({
  user: 'docker',
  pwd: 'docker',
  roles: [
    {
      role: 'readWrite',
      db: 'tasks-app',
    },
  ],
});
