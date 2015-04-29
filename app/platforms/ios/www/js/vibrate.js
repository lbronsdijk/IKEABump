var Vibration = function () {

    var _vibrationInterval;

    this.play = function (delay, loop){

        clearInterval(_vibrationInterval);

        if(loop){
            _vibrationInterval = window.setInterval(function(){
                navigator.vibrate(1);
            }, delay);
        } else {
            navigator.vibrate(1);
        }
    };

    this.stop = function (){

        if(_vibrationInterval != null){
            clearInterval(_vibrationInterval);
        }
    };

    return this;
};
