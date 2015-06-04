var animate = (function () {

  /**
   * 通用动画函数
   * @param opts {Object} 动画所需参数
   * @param opts.delay {number} 动画两帧之间的间隔,单位为ms
   * @param opts.duration {number} 动画总时长,单位为ms
   * @param opts.delta {function} 时间进度到动画进度的映射函数,
   *    参数为[0,1]之间的时间进度,返回值为[0,1]之间的动画进度
   * @param opts.step {function} 实际执行动画帧状态修改的函数,
   *    参数为动画进度delta,然后执行所需的属性修改
   **/
  function animate(opts) {

    var start = new Date();

    var id = setInterval(function () {

      var timePassed = new Date() - start;
      var progress = timePassed / opts.duration;

      if (progress > 1) {
        progress = 1;
      }

      var delta = opts.delta(progress);
      opts.step(delta);

      if (progress === 1) {
        clearInterval(id);
      }
    }, opts.delay || 10);
  }

  // 预定义的常用delta函数
  var delta = {};
  animate.delta = delta;

  // 线性delta
  delta.linear = function (progress) {
    return progress;
  };

  // 平方
  delta.quad = function (progress) {
    return Math.pow(progress, 2);
  };

  // 圆弧
  delta.circ = function (progress) {
    return 1 - Math.sin(Math.acos(progress));
  };

  // 弓
  delta.bow = function (progress, x) {
    return Math.pow(progress, 2) * ((x + 1) * progress - x);
  };

  // 弹跳(乒乓球落地)
  delta.bounce = function (progress) {
    for (var a = 0, b = 1, result; 1; a +=b, b /= 2) {
      if (progress >= (7 - 4 * a) / 11) {
        return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
      }
    }
  };

  // 弹性
  delta.elastic = function (progress, x) {
    return Math.pow(2, 10 * (progress-1)) * Math.cos(20*Math.PI*x/3*progress);
  };

  // 文本框动画
  animate.animateText = function (textArea) {
    var text = textArea.value;
    var to = text.length,
      from = 0;

    animate({
      delay: 20,
      duration: 5000,
      delta: delta.bounce,
      step: function (delta) {
        var result = (to - from) * delta + from;
        textArea.value = text.substr(0, Math.ceil(result));
      }
    });
  };


  return animate;
}());
