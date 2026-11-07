import { useLocation } from 'react-router-dom';
import { useAppDispatch } from 'store/ReduxHooks';
import { menuAccess } from 'store/slice/MenuSlice';

const ModuleSettingUtill = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  dispatch(menuAccess(location));

  return null;
};

export default ModuleSettingUtill;
