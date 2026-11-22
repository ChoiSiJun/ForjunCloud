import useWebPersonalQuery from '../api/useWebPersonalQuery';

const usePublicPersonal = (userId: string) => useWebPersonalQuery({ userId });

export default usePublicPersonal;