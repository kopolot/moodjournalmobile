import { Redirect } from 'expo-router';

/** Legacy route — history replaces explore. */
export default function ExploreRedirect() {
  return <Redirect href="/(app)/history" />;
}
