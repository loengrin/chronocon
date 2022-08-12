
/**
 * Helper fot date formatting and generating date labels
 */
export  class DateFormatter
{
    constructor(labels, lang, mode) {
        if(!labels) {
            console.trace();
        }
        this.lang = lang ? lang : 'en';
        this.labels = labels;
        this.mode = mode;
    }
    
    getMonthName(month){
      var monthLabels = {1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",
        7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"};  
      return this.labels[monthLabels[month]];
    };

    getDateLabel(date){
      if(this.mode === 'series') return this.getSeriesLabel(date.year);   
      if(this.mode === 'century') return this.getAgeLabel(date.year);
      if(this.mode === 'decade') return this.getDecadeLabel(date.year);
      if(this.mode === 'hour') return this.getMonthName(date.month)+", "+date.day+" "+this.getHourLabel(date.hour);
      return (this.mode === 'day' ? " "+date.day : "") +
              (this.mode !== 'year' ? " "+this.getMonthName(date.month) : "")+" "+this.getYearLabel(date.year);
    };

    getYearLabelShort(year){
     return year > 0 ? year+this.getYearLetter() : -year+this.getYearLetter();
    };

    getYearLetter(year){ 
     return (this.lang === 'ru' ? "г." : "");
    };

    getAgeLetter(year){ 
     return (this.lang === 'ru' ? "в." : "");
    };

    getYearLabel(year){
      if(this.mode === 'series') return this.getSeriesLabel(year);
      if(this.mode === 'century') return this.getAgeLabel(year);
      if(this.mode === 'decade') return this.getDecadeLabel(year);
      return year > 0 ? year+' '+this.getYearLetter()+' '+this.labels['AD'] : -year+' '+this.getYearLetter()+' '+this.labels['BC'];
    };

    getDecadeLabel(year){
     return Math.floor(year/10)*10+(this.lang === 'ru' ? "-е" : "s");
    };

    getAgeLabel(year){
     return this.getAgeLabelShort(year)+' '+this.getAgeLetter()+' '+(year >= 0 ? this.labels['AD'] : this.labels['BC']);
    };

    getAgeLabelShort(year){
    if(year == 0 ) return this._romanize(1);
     return year > 0 ? this._romanize(Math.floor(year/100)+1) : this._romanize(Math.floor(year/100));
    };

    getSeriesLabel(series){
     return series +" "+ this.labels['Series'];
    };

    getSeasonLabel(series){
      var season = (Math.floor(series/10)+1);
      //work around for GOT
      if(series == 68) {
          season = 8;
      }
      return  season + " " + this.labels['Season'];
    };

    getHourLabel(hour){
        return hour+":00";
    }

    getMilleniumLabel(year){
     return year >= 0 ? (Math.floor(year/1000)+1)+this.labels['st']+" "+this.labels['millenium']+" "+this.labels['AD'] :
                     -(Math.floor(year/1000))+this.labels['st']+" "+this.labels['millenium']+" "+this.labels['BC'];
    };

    _romanize(num) {
        if(num < 0){
           num = -num;
        }
        if (!+num)
            return false;
        var digits = String(+num).split(""),
            key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
                   "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
                   "","I","II","III","IV","V","VI","VII","VIII","IX"],
            roman = "",
            i = 3;
        while (i--)
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    }
}
