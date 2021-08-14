# Pomodoro Timer

The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s.
The technique uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a pomodoro, from the Italian word for 'tomato', after the tomato-shaped kitchen timer that Cirillo used as a university student.

This application uses Bootstrap 4 for styling and Open-Iconic icons for icons.

## Installation

First clone or download the zip of the repo from [Pomodoro Repo](https://github.com/jdavisson87/thinkful-pomodoro)

Go to the terminal and go to the project folder and run `npm install`.
Once the packages are installed, you can run `npm start` and the application should open at [localhost:3000](http://localhost:3000/thinkful-pomodoro)

## Using the Timer

### Initial Screen

On the top left of the initial screen, you will see the focus duration. As the user, you are allowed to change the amount of time you would like to focus for. The minimum amount of time you can focus for is 5 minutes, and you can increment up to 60 minutes.

On the top right of the initial screen, you will see the break duration. As the user, you are allowed to change the amount of time you would like to break for in between focus sections. You can have your break last for a minimum of 1 minute and up to 15 minutes.

Once you have your focus and break durations set, all you have to do is press the play button. Once pressed, the timer will start and you can get to work. Once your current duration is complete, the timer will sound an alert to let you know to take a break or go back to focusing. The timer will automatically start the next duration for you. It will continue to run until you hit the pause or stop button.

The pause button will pause whatever duration you are currently in. You can press play to start it back up. While paused or while the timers are running, you are not able to change the break or focus duration. If you want to change the durations, you will have to stop and reset the timer.

If you press the stop button, it will stop the timer and will reset the entire timer.
