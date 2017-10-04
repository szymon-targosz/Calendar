class Calendar{
    constructor(){
        const currentDate = new Date();
        this.currentDay = currentDate.getDate();
        this.currentMonth = currentDate.getMonth();
        this.currentYear = currentDate.getFullYear();
        this.daysNames = ['Sun', 'Mon','Tue','Wed','Thu','Fri', 'Sat'];
        this.monthsNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.tasksList = {};
    }

    next(){
        console.log(this.currentMonth);
        if(this.currentMonth === 11){
            this.currentYear += 1;
            this.currentMonth = 0;
        } else{
            this.currentMonth += 1;
        };
        console.log(this.currentMonth);
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

    render(){
        this.createCalendar(this.currentYear, this.currentMonth);
        this.tasks();
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

    tasks(){
        const self = this;
        const tds = document.querySelectorAll('td:not(.otherMonth)');
        tds.forEach(function(elem){
            elem.addEventListener("click", showTaskElem);
        });

        function showTaskElem(e){
            console.log(this);
            const choosen = document.querySelector('.choosen');
            if(choosen != null){
                document.querySelector('.choosen').classList.remove('choosen');
            };
            document.getElementById('task').style.display = 'block';


            let date = '';
            if(Number.parseInt(this.innerHTML) < 10){
                date += '0' + this.innerHTML + '.';
            } else{
                date += this.innerHTML + '.';
            };

            if(self.currentMonth + 1 < 10){
                date += `0${self.currentMonth + 1}.`;
            } else{
                date += (self.currentMonth + 1) + '.';
            };

            date += self.currentYear;

            const dataCheck = date.replace(/\./g, '');

            document.querySelector('#task p').innerHTML = date;
            this.classList.add('choosen');

            // reset list and show tasks from this.tasksList
            let ol = document.querySelector('ol');
            while(ol.firstChild){
                ol.removeChild(ol.firstChild)
            };

            const dataTasks = self.tasksList[`${dataCheck}`];
            if(dataTasks != undefined){
                for (var i = 0; i < dataTasks.length; i++) {

                    const newLi = document.createElement('li');
                    const delBtn = document.createElement('button');
                    delBtn.classList.add('delete');
                    delBtn.innerHTML = 'delete';

                    const doneBtn = document.createElement('button');
                    doneBtn.classList.add('done');
                    doneBtn.innerHTML = 'done';

                    newLi.innerHTML = dataTasks[i];
                    newLi.appendChild(delBtn);
                    newLi.appendChild(doneBtn);
                    document.querySelector('ol').appendChild(newLi);
                }
            };
        }

        // X close button
        document.querySelector('#close').addEventListener('click', close);

        function close(e){
            document.getElementById('task').style.display = 'none';
            const choosenTds = document.querySelector('.choosen').classList.remove('choosen');
        }
    }

    addTask(){
        const self = this;
        document.querySelector('#addBtn').addEventListener('click', addTask);
        function addTask(e){
            console.log('addTask func');
            const inputValue = document.querySelector('input').value;

            // update this.tasksList object - new data
            const taskDate = document.querySelector('#task p').innerHTML;
            const taskDateChanged = taskDate.replace(/\./g, '');
            if(self.tasksList.hasOwnProperty(taskDateChanged)){
                self.tasksList[`${taskDateChanged}`].push(inputValue);
            } else {
                self.tasksList.x = [inputValue];
                let str = null;
                str = JSON.stringify(self.tasksList);
                str = str.replace('x', taskDateChanged);
                self.tasksList = JSON.parse(str)
            };
            console.log(self.tasksList);

            // new li element
            const newLi = document.createElement('li');
            const delBtn = document.createElement('button');
            delBtn.classList.add('delete');
            delBtn.innerHTML = 'delete';

            const doneBtn = document.createElement('button');
            doneBtn.classList.add('done');
            doneBtn.innerHTML = 'done';

            newLi.innerHTML = inputValue;
            newLi.appendChild(delBtn);
            newLi.appendChild(doneBtn);
            document.querySelector('ol').appendChild(newLi);
            document.querySelector('input').value = '';
        }
    }


}

document.addEventListener('DOMContentLoaded', function(){
    const test = new Calendar()
    test.render();
    test.buttons();
    test.addTask();

});
