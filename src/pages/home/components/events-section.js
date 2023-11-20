
import React, { useEffect, useState } from 'react';

import Header from './header';

import Bg from './../../../assets/images/bg-1.png';
import Ceremonial from './../../../assets/images/akad.jpg';
import Party from './../../../assets/images/resepsi.jpeg';
import Traditional from './../../../assets/images/mulung-mantu.jpg';

import Left from './../../../assets/svgs/left.svg';
import Right from './../../../assets/svgs/right.svg';

const EventsSection = React.forwardRef((props, ref) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [countDown, setCountDown] = useState({days: 0, hours: 0, minutes: 0, seconds: 0});

  useEffect(() => {
    setSelectedDate('11/17/2023 22:49');
  }, [])

  useEffect(() => {
    let  intervalTimer = null;
    if (selectedDate) {
      const endDate = new Date(selectedDate);
      const _second = 1000;
      const _minute = _second * 60;
      const _hour = _minute * 60;
      const _day = _hour * 24;

      const showRemaining = () => {
        let now = new Date();
        let distance = endDate - now;
        if (distance <= 0) {
          clearInterval(intervalTimer);
        } else {
          let days = Math.floor(distance / _day);
          let hours = Math.floor((distance % _day) / _hour);
          let minutes = Math.floor((distance % _hour) / _minute);
          let seconds = Math.floor((distance % _minute) / _second);
          setCountDown({days, hours, minutes, seconds});
        }
      }

      intervalTimer = setInterval(showRemaining, 1000);
    }

    return () => {
      if (intervalTimer) clearInterval(intervalTimer);
    }
  }, [selectedDate]);
  
  return (
    <div ref={ref} className="w-screen min-h-screen relative flex flex-col">
      <Header
        title={'Events'}
        textColor={'text-light-pink'}
        zIndex='z-[1]'
        dropShadow={true}
      />

      <img src={Bg} className="w-full h-full absolute top-0 left-0 object-cover opacity-40" alt="bg"/>
      <div className="w-full h-full absolute top-0 left-0 bg-black opacity-30" />

      <div className="w-full desktop:h-full flex flex-col p-5 text-dark-pink tablet:items-center desktop:p-10">

        <div className="w-full h-fit flex flex-col gap-5 font-puppies text-lg desktop:text-2xl tablet:flex-row tablet:w-1/2 desktop:w-full desktop:gap-10 z-[1]">
          <div className={`w-full flex flex-row gap-5 desktop:gap-10`}>
            <div className="w-full h-[70px] bg-light-pink shadow-lg rounded-md flex flex-col items-center justify-between p-2 desktop:px-10 desktop:flex-row">
              <span className="font-bold">Days</span>
              <span className="desktop:text-lg font-bold">{countDown?.days}</span>
            </div>
            <div className="w-full h-[70px] bg-light-pink shadow-lg rounded-md flex flex-col items-center justify-between p-2 desktop:px-10 desktop:flex-row">
              <span className="font-bold">Hours</span>
              <span className="desktop:text-lg font-bold">{countDown?.hours}</span>
            </div>
          </div>
          <div className={`w-full flex flex-row gap-5 desktop:gap-10`}>
            <div className="w-full h-[70px] bg-light-pink shadow-lg rounded-md flex flex-col items-center justify-between p-2 desktop:px-10 desktop:flex-row">
              <span className="font-bold">Minutes</span>
              <span className="desktop:text-lg font-bold">{countDown?.minutes}</span>
            </div>
            <div className="w-full h-[70px] bg-light-pink shadow-lg rounded-md flex flex-col items-center justify-between p-2 desktop:px-10 desktop:flex-row">
              <span className="font-bold">Seconds</span>
              <span className="desktop:text-lg font-bold">{countDown?.seconds}</span>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5 mt-5 tablet:items-center desktop:flex-row desktop:gap-10 desktop:mt-10 desktop:items-start desktop:h-full">

          <div className="w-full bg-light-pink rounded-md shadow-lg relative tablet:w-1/2 desktop:w-full desktop:h-full">
            <img src={Left} className="h-[40%] absolute left-0 bottom-0" alt="shape"/>
            <img src={Right} className="h-[40%] absolute right-0 bottom-0 -scale-y-100" alt="shape"/>

            <div className="w-full flex flex-col items-center p-5 gap-5">
              <span className="text-2xl text-center font-imperial-script font-bold">Ceremonial (Akad)</span>
              <img src={Ceremonial} className="w-full desktop:h-[300px] z-[1] object-cover rounded-md border border-dark-pink" alt="bg" />
              <div className="w-full flex flex-col items-center">
                <div className="w-full flex flex-row gap-5 justify-center">
                  <i className="fa-solid fa-calendar-check"></i>
                  <span>Januari 01, 2021</span>
                </div>
                <div className="w-full flex flex-row gap-5 justify-center">
                  <i className="fa-solid fa-clock"></i>
                  <span>09:00 - 10:00</span>
                </div>
              </div>
              <div className="w-full flex flex-row gap-5 justify-center text-sm z-[1]">
                <i className="fa-solid fa-location-dot"></i>
                <span className="text-center">Streen A No 123, 4 Floor</span>
              </div>
              <div className="w-fit transition-all duration-500 ease-in-out flex items-center justify-center px-4 py-2 bg-white text-dark-pink font-bold rounded-md shadow-lg cursor-pointer hover:bg-dark-pink hover:text-white">Open on Maps</div>
            </div>
          </div>

          <div className="w-full bg-light-pink rounded-md shadow-lg relative tablet:w-1/2 desktop:w-full desktop:h-full">
            <img src={Left} className="h-[40%] absolute left-0 bottom-0" alt="shape"/>
            <img src={Right} className="h-[40%] absolute right-0 bottom-0 -scale-y-100" alt="shape"/>

            <div className="w-full flex flex-col items-center p-5 gap-5">
              <span className="text-2xl text-center font-imperial-script font-bold">Party (Resepsi)</span>
              <img src={Party} className="w-full desktop:h-[300px] z-[1] object-cover rounded-md border border-dark-pink" alt="bg" />
              <div className="w-full flex flex-col items-center">
                <div className="w-full flex flex-row gap-5 justify-center">
                  <i className="fa-solid fa-calendar-check"></i>
                  <span>Januari 01, 2021</span>
                </div>
                <div className="w-full flex flex-row gap-5 justify-center">
                  <i className="fa-solid fa-clock"></i>
                  <span>09:00 - 10:00</span>
                </div>
              </div>
              <div className="w-full flex flex-row gap-5 justify-center text-sm z-[1]">
                <i className="fa-solid fa-location-dot"></i>
                <span className="text-center">Streen A No 123, 4 Floor</span>
              </div>
              <div className="w-fit transition-all duration-500 ease-in-out flex items-center justify-center px-4 py-2 bg-white text-dark-pink font-bold rounded-md shadow-lg cursor-pointer hover:bg-dark-pink hover:text-white">Open on Maps</div>
            </div>
          </div>

          <div className="w-full bg-light-pink rounded-md shadow-lg relative tablet:w-1/2 desktop:w-full desktop:h-full">
            <img src={Left} className="h-[40%] absolute left-0 bottom-0" alt="shape"/>
            <img src={Right} className="h-[40%] absolute right-0 bottom-0 -scale-y-100" alt="shape"/>

            <div className="w-full flex flex-col items-center p-5 gap-5">
              <span className="text-2xl text-center font-imperial-script font-bold">Traditional Events</span>
              <img src={Traditional} className="w-full desktop:h-[300px] z-[1] object-cover rounded-md border border-dark-pink" alt="bg" />
              <div className="w-full flex flex-col items-center">
                <div className="w-full flex flex-row gap-5 justify-center">
                  <i className="fa-solid fa-calendar-check"></i>
                  <span>Januari 01, 2021</span>
                </div>
                <div className="w-full flex flex-row gap-5 justify-center">
                  <i className="fa-solid fa-clock"></i>
                  <span>09:00 - 10:00</span>
                </div>
              </div>
              <div className="w-full flex flex-row gap-5 justify-center text-sm z-[1]">
                <i className="fa-solid fa-location-dot"></i>
                <span className="text-center">Streen A No 123, 4 Floor</span>
              </div>
              <div className="w-fit transition-all duration-500 ease-in-out flex items-center justify-center px-4 py-2 bg-white text-dark-pink font-bold rounded-md shadow-lg cursor-pointer hover:bg-dark-pink hover:text-white">Open on Maps</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
})

export default EventsSection;