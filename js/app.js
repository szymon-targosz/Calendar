class Calendar{
    constructor(){
        const currentDate = new Date();
        this.currentDay = currentDate.getDate();
        this.currentMonth = currentDate.getMonth();
        this.currentYear = currentDate.getFullYear();
        this.daysNames = ['Sun', 'Mon','Tue','Wed','Thu','Fri', 'Sat'];
        this.monthsNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.tasksList = {11102017:['mleko', 'jajka'], 23112017: ['pomidory', 'ziemniaki']};
        this.td = null;
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

        let list = document.querySelector('ol');

        list.addEventListener('click', function(event) {

            if(event.target.className === 'delete'){
                // remove item from objecy this.tasksList
                let thisTask = '';
                const thisTaskDate = document.querySelector('#task header p').innerHTML;

                for(let i = 0; i < event.target.parentElement.innerHTML.indexOf('<'); i++){
                    thisTask += event.target.parentElement.innerHTML[i];
                };
                const thisTaskDateCheck = thisTaskDate.replace(/\./g, '');

                const indexOfTheTask = self.tasksList[`${thisTaskDateCheck}`].indexOf(thisTask);
                self.tasksList[`${thisTaskDateCheck}`].splice(indexOfTheTask, 1)

                // remove item from list
                event.target.parentElement.remove();

            } else if (event.target.className === 'done'){

                if(event.target.parentElement.style.textDecoration != 'line-through'){
                    event.target.parentElement.style.textDecoration = 'line-through';
                } else{
                    event.target.parentElement.style.textDecoration = 'none';
                };
            };
        });
    }

    render(){
        this.createCalendar(this.currentYear, this.currentMonth);
        this.tasks();
        this.mark();
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
        // display calendar
        document.getElementById('calendarTable').innerHTML = calendarTable;
    }

    mark(){
        console.log(this.tasksList);
        const keys = Object.keys(this.tasksList);
        console.log(keys);
    }

    tasks(){
        const self = this;
        const tds = document.querySelectorAll('td:not(.otherMonth)');
        tds.forEach(function(elem){
            elem.addEventListener('click', showTaskElem);
        });

        function showTaskElem(e){
            self.td = this;

            const choosen = document.querySelector('.choosen');
            if(choosen != null){
                document.querySelector('.choosen').style.color = '#E0E0E0';
                document.querySelector('.choosen').classList.remove('choosen');
            };
            document.getElementById('task').style.display = 'block';
            this.style.color = '#E50000';

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
        const addBtn = document.querySelector('#addBtn');

        addBtn.addEventListener('click', addTask);

        function addTask(e){
            const inputValue = document.querySelector('input').value;

            if(inputValue === ''){
                document.querySelector('input').setAttribute('placeholder', 'You have to type something');
            } else{
                document.querySelector('input').setAttribute('placeholder', 'Add task...');

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

                // clear input
                document.querySelector('input').value = '';

                self.mark();
            };
        }
    }
}

document.addEventListener('DOMContentLoaded', function(){
    const test = new Calendar()
    test.render();
    test.buttons();
    test.addTask();
});
