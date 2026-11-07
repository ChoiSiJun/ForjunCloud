import { personal } from '@config/Menu/Personal';

// 모듈 정의 ( 사용권한에 따라 오픈 )
const packageInfo = [
  {
    packageCode: 'PERSONAL',
    packageName: 'Personal Statement',
    moduleList: personal,
  },
];

export default packageInfo;
