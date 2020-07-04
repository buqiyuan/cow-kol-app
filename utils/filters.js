/*
* 封装一些常用的过滤器
* */

const filters = new class {
    second = 1000
    minute = this.second * 60
    hour = this.minute * 60
    day = this.hour * 24
    halfamonth = this.day * 15
    month = this.day * 30

    /**
     * 给定时间戳，算出多久前
     * @param {TimeStamp} dateTimeStamp - 时间戳（毫秒）
     * @Description:
     * @author bqy
     * @date 2020/7/4
     */
    dateAgo(dateTimeStamp) {
        if (typeof dateTimeStamp !== 'number') dateTimeStamp = new Date(dateTimeStamp).getTime()
        let diffValue = Date.now() - dateTimeStamp
        if (diffValue < 0) return
        let month = diffValue / this.month
        let week = diffValue / (7 * this.day)
        let day = diffValue / this.day
        let hour = diffValue / this.hour
        let minute = diffValue / this.minute
        let result = ''
        if (month >= 1) {
            result = parseInt(month) + "月前"
        } else if (week >= 1) {
            result = parseInt(week) + "周前"
        } else if (day >= 1) {
            result = parseInt(day) + "天前"
        } else if (hour >= 1) {
            result = parseInt(hour) + "小时前"
        } else if (minute >= 1) {
            result = parseInt(minute) + "分钟前"
        } else {
            result = "刚刚"
        }
        return result
    }

    /**
     * 计算时间差
     * @param startTime
     * @param endTime
     * @param diffType
     * @returns {number}
     * @constructor
     */
    dateDiff(startTime, endTime, diffType) {
        // //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
        // startTime = startTime.replace(/\-/g, "/");
        // endTime = endTime.replace(/\-/g, "/");

        //将计算间隔类性字符转换为小写
        diffType = diffType.toLowerCase();
        let sTime = new Date(startTime);      //开始时间
        let eTime = new Date(endTime);  //结束时间
        return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(this[diffType] || 1));
    }

    install(Vue) {
        let methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(filters))
        let ignore = ["constructor", 'install']
        console.log(methodNames)

        methodNames.forEach(name => {
            if (!ignore.includes(name)) {
                Vue.filter(name, this[name].bind(this))
            }
        })
    }
}()

export default filters
