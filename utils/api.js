import User from '@/apis/user.js'
import Article from '@/apis/article.js'
import Portal from '@/apis/portal.js'
import Xiaoce from '@/apis/xiaoce.js'



export default {
	user: new User(),
	Article: new Article(),
	Portal: new Portal(),
	Xiaoce: new Xiaoce(),
}
