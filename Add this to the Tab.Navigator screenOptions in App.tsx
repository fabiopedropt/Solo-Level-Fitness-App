tabBarStyle: ({ route }) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';
  if (routeName === 'Workout') {
    return { display: 'none' };
  }
  return {};
},