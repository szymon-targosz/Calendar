class Calendar{
    constructor(){
        const currentDate = new Date();
        this.currentDay = currentDate.getDate();
        this.currentMonth = currentDate.getMonth();
        this.currentYear = currentDate.getFullYear();
        this.daysNames = ['Sun', 'Mon','Tue','Wed','Thu','Fri', 'Sat'];
        this.monthsNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }

    next(){
        if(this.currentMonth === 11){
            this.currentYear += 1;
            this.currentMonth = 0;
        } else{
            this.currentMonth += 1;
        };
        this.render();
    }

    prev(){
        if(this.currentMonth === 0){
            this.currentYear -= 1;
            this.currentMonth = 11;
        } else{
            this.currentMonth -= 1;
        };
        this.render();
    }

    buttons(){
        const self = this;
        document.getElementById('prev').addEventListener('click', function(){
            self.prev();
        });
        document.getElementById('next').addEventListener('click', function(){
            self.next();
        });
    }

    tasks(){
        const tds = document.querySelectorAll('td');
        console.log(tds);
        for (var i = 0; i < tds.length; i++) {
            tds[i].addEventListener('click', task)
        };

        function task(e){
            this.classList.add('choosen');
            document.getElementById('task').style.display = 'block';
        }
    }

    render(){
        this.createCalendar(this.currentYear, this.currentMonth);
    }

    createCalendar(year, month){
        const beginning = new Date(year, month, 1).getDay()
        const end = new Date(year, month + 1, 0).getDate();
        let endOfPrev = null;
        if(month !== 0){
            endOfPrev = new Date(year, month, 0).getDate();
        } else{
            endOfPrev = new Date(year - 1, 11, 0).getDate();
        };
        document.querySelector('p').innerHTML = `${this.monthsNames[month]} ${year}`;
        let calendarTable = '<table><thead><tr>';
        for(let i = 0; i < this.daysNames.length; i++){
            calendarTable += '<th>' + this.daysNames[i] + '</th>'
        };
        calendarTable += '</thead></tr><tbody>';

        let i = 1;
        do{
            let dayOfTheWeek = new Date(year, month, i).getDay();
            if(dayOfTheWeek === 0){
                calendarTable += '<tr>';
            } else if(i === 1){
                calendarTable += '<tr>';
                let x = endOfPrev - beginning + 1;
                for(let j = 0; j < beginning; j++) {
                  calendarTable += '<td class="otherMonth">' + x + '</td>';
                  x++;
                };
            };

            const control = new Date();
            const controlMonth = control.getMonth();
            const controlYear = control.getFullYear();
            if(controlYear === this.currentYear && controlMonth === this.currentMonth && i === this.currentDay){
                calendarTable += '<td id="now">' + i + '</td>';
              } else{
                calendarTable += '<td class="common">' + i + '</td>';
              };

            if(dayOfTheWeek === 6){
                calendarTable += '</tr>';
            } else if(i === end){
                let n = 1;
                for(dayOfTheWeek; dayOfTheWeek < 6; dayOfTheWeek++) {
                  calendarTable += '<td class="otherMonth">' + n + '</td>';
                  n++;
                };
            };
            i++;
        } while(i <= end);
        calendarTable += '</tbody></table>';
        document.getElementById('calendarTable').innerHTML = calendarTable;
    }
}

document.addEventListener('DOMContentLoaded', function(){
    const test = new Calendar()
    test.render();
    test.buttons();

});
