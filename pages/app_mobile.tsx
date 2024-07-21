import { useSession } from 'next-auth/react';
import ComingSoon from '../components/ComingSoon';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <ComingSoon />
    </div>
  );
}
