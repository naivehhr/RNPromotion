/**
* @Author: huhaoran <aran.hu>
* @Date:   17-10-16
* @Email:  huhaoran3@ucfgroup.com
* @Last modified by:   aran.hu
* @Last modified time: 25-10-16
* @License: © 2016 NCF GROUP ALL RIGHTS RESERVED
*/



/**
 * by ramroll on 16/4/25.
 *
 */

const confs =   {
  SecondPageComponent : {
    name : "SecondPageComponent",
    component: () => {require("../containers/SecondPageComponent")}
  },

}
// confs.initial = confs.Home
// 验证手势密码
//confs.initial = confs.ValidateGesturePassword
//修改手势密码
//confs.initial = confs.ModifyGesturePassword

export const PagesConfig = confs
