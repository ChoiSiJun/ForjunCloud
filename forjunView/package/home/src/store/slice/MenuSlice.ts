import { createSlice } from '@reduxjs/toolkit';
import packageInfo from '@config/Menu/Package';

export interface MenuProps {
  menuCode: string;
  menuName: string;
  menuPath: string;
}

export interface ModuleProps {
  moduleCode: string;
  moduleName: string;
  modulePath: string;
  menuList?: MenuProps[];
}

export interface PackageProps {
  packageCode: string;
  packageName: string;
  moduleList?: ModuleProps[];
}

export interface PackageInfoProps {
  packageList: PackageProps[];
  accessPackageIndex: number;
  accessPackageCode: string;
  accessPackageName: string;
  accessModuleCode: string;
  accessModuleName: string;
  accessMenuCode: string;
  accessMenuName: string;
  accessPath: string;
}

const initialState: PackageInfoProps = {
  packageList: packageInfo,
  accessPackageIndex: 0,
  accessPackageCode: '',
  accessPackageName: '',
  accessModuleCode: '',
  accessModuleName: '',
  accessMenuCode: '',
  accessMenuName: '',
  accessPath: '',
};

export const MenuInfoSlice = createSlice({
  name: 'menuInfo',
  initialState,
  reducers: {
    menuAccess: (state, action) => {
      const location = action.payload;
      state.packageList.forEach(packageItem => {
        packageItem.moduleList?.forEach(moduleItem => {
          moduleItem.menuList?.forEach(menuItem => {
            if (location.pathname === menuItem.menuPath) {
              // 패키지 , 모듈 , 메뉴 정보 세팅
              state.accessPackageCode = packageItem.packageCode;
              state.accessPackageName = packageItem.packageName;
              state.accessModuleCode = moduleItem.moduleCode;
              state.accessModuleName = moduleItem.moduleName;
              state.accessMenuCode = menuItem.menuCode;
              state.accessMenuName = menuItem.menuName;
              state.accessPath = menuItem.menuPath;
            }
          });
        });
      });

      return state;
    },
    packageAccess: (state, action) => {
      const selectIndex = action.payload;
      state.accessPackageIndex = selectIndex;

      return state;
    },
  },
});

export const { menuAccess, packageAccess } = MenuInfoSlice.actions;
export default MenuInfoSlice.reducer;
