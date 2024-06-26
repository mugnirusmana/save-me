import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from 'lodash';
import moment from 'moment';

import { defaultReservation, submitReservation } from './../../redux/reservationSlice';
import { defaultCommentList, getCommentList } from './../../redux/commentSlice';
import { defaultSetting, getSetting } from "../../redux/settingSlice";

import ImageModal from "./components/image-modal";
import Loader from './components/loader';
import NotAvailable from "./components/not-available";
import Envelope from "./components/envelope";
import Alert from "./components/alert";
import Menu from "./components/menu";
import ScrollToTop from "./components/scrollToTop";
import MusicPlayer from "./components/musicPlayer";
import HomeSection from './components/home-section';
import AboutUsSection from './components/about-us-section';
import OurStorySection from './components/our-story-section';
import EventsSection from "./components/events-section";
import BridesmaidsGroomsmanSection from "./components/bridesmaids-groomsman-section";
import GallerySection from "./components/gallery-section";
import ReservationSection from "./components/reservation-section";
import CommentSection from './components/comment-section';
import EndSection from "./components/end-section";
import Footer from "./components/footer";

import { formatDateCoundown, getWindowDimensions } from './../../helper';
import { useQueryParams } from "../../config/hook";

const Home = () => {
  const dispatch = useDispatch();
  const queryParams = useQueryParams();
  const [name, setName] = useState(queryParams?.name?.replaceAll('__', ' '));
  const reservationSlice = useSelector(({ reservation }) => reservation);
  const commentSlice = useSelector(({ comment }) => comment);
  const settingSlice = useSelector(({ setting }) => setting);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [showUnvailable, setShowUnvailable] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [activeMenu, setActiveMenu] = useState('home');
  const [showMenu, setShowMenu] = useState(true);
  const [showToTop, setShowToTop] = useState(false);
  const [imageModal, setImageModal] = useState({
    show: false,
    data: null,
  });
  const [showCopyText, setShowCopyText] = useState(false);
  const [snowNotifGlobal, setShowNotifGlobal] = useState({
    show: false,
    title: '',
    type: '',
    message: '',
    confirmButtonText: '',
    action: () => {}
  })
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [dataForm, setDataForm] = useState(null);
  const [dataComment, setDataComment] = useState([]);
  const [playMusic, setPlayMusic] = useState(false);
  const homeRef = useRef();
  const aboutUsRef = useRef();
  const ourStoryRef = useRef();
  const eventsRef = useRef();
  const bridesmaidsGroomsmanRef = useRef();
  const galleryRef = useRef();
  const reservationRef = useRef();
  const endRef = useRef();

  const offSetHideMenuDesktopSize = 300;
  const desktopSize = 1025;
  const scrollRef = useRef();

  const listMenu = [
    {
      label: 'Home',
      slug: 'home',
      show: true,
      ref: homeRef,
      nextRef: aboutUsRef,
    },
    {
      label: 'About Us',
      slug: 'about_us',
      show: true,
      ref: aboutUsRef,
      nextRef: ourStoryRef,
    },
    {
      label: 'Our Story',
      slug: 'our_story',
      show: true,
      ref: ourStoryRef,
      nextRef: eventsRef,
    },
    {
      label: 'Events',
      slug: 'events',
      show: true,
      ref: eventsRef,
      nextRef: bridesmaidsGroomsmanRef,
    },
    {
      label: 'Bridesmaids & Groomsman',
      slug: 'bridesmaids_groomsman',
      show: true,
      ref: bridesmaidsGroomsmanRef,
      nextRef: galleryRef,
    },
    {
      label: 'Gallery',
      slug: 'gallery',
      show: true,
      ref: galleryRef,
      nextRef: reservationRef,
    },
    {
      label: 'Reservation',
      slug: 'reservation',
      show: true,
      ref: reservationRef,
      nextRef: endRef,
    },
    {
      label: 'End Section',
      slug: 'endsection',
      show: false,
      ref: endRef,
    }
  ];

  useEffect(() => {
    setFirstLoaded(true);

    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (firstLoaded) {
      setName(queryParams?.name?.replaceAll('__', ' '));
      setFirstLoaded(false);
      dispatch(getSetting());
    }
  }, [firstLoaded]);

  useEffect(() => {
    if (windowDimensions.width <= (desktopSize-1)) {
      setShowMenu(false); //for tablet & mobile size
    } else {
      if (windowDimensions.position >= offSetHideMenuDesktopSize) {
        setShowMenu(false); //for desktop size
      } else {
        setShowMenu(true);
      }
    }

    if (windowDimensions.position > offSetHideMenuDesktopSize) {
      setShowToTop(true);
    } else {
      setShowToTop(false);
    }

    updateActiveMenu();
  }, [windowDimensions]);

  useEffect(() => {
    let {
      isLoading,
      isSuccess,
      isError,
      errorMessage,
      errorCode,
      data,
    } = reservationSlice;

    if (!isLoading && isSuccess) {
      setShowSubmitForm(false);
      setShowNotifGlobal({
        show: true,
        title: 'Submit Form',
        type: 'success',
        message: '<div class="w-full text-center flex flex-col items-center justify-center"><span class="text-base font-bold">Terimakasih telah mengisi form</span><br class="hidden" /><span class="text-xs">Kita telah mengirimkan anda link QR Code ke email anda</span><br class="hidden" /><span class="text-xs">Anda bisa menggunakan QR tersebut untuk kehadiran anda</span><br class="hidden" /><span class="text-xs">ataupun manual tanda tangan pada buku tamu</span></div>',
        confirmButtonText: 'Copy link QR & Tutup',
        action: () => {
          navigator.clipboard.writeText(data?.link_qr);
          setShowNotifGlobal({
            ...snowNotifGlobal,
            show: false,
          });
          setTimeout(() => {
            setShowNotifGlobal({
              show: false,
              title: '',
              type: '',
              message: '',
              confirmButtonText: '',
              action: () => {}
            });
            dispatch(defaultReservation());
            setShowCopyText(true);
          }, 500);
        }
      })
    }

    if (!isLoading && isError) {
      setShowSubmitForm(false);
      
      if (errorCode === 400) {
        let resultErrorList = renderListError();
        setShowNotifGlobal({
          show: true,
          title: 'Submit Form',
          type: 'warning',
          message: `<span class="text-center flex flex-col w-full items-center justify-center"><span class="text-base font-bold">Terjadi kesalahan dengan data yang anda kirim${resultErrorList?':':''}</span>${resultErrorList ? `<br class="hidden" />${resultErrorList}` : ''}</span>`,
          confirmButtonText: 'Confirm',
          action: () => {
            setShowNotifGlobal({
              ...snowNotifGlobal,
              show: false,
            });
            setTimeout(() => {
              setShowNotifGlobal({
                show: false,
                title: '',
                type: '',
                message: '',
                confirmButtonText: '',
                action: () => {}
              });
              dispatch(defaultReservation());
            }, 1000)
          }
        })
      } else {
        setShowNotifGlobal({
          show: true,
          title: 'Submit Form',
          type: 'warning',
          message: `<span class="text-center">${errorMessage}</span>`,
          confirmButtonText: 'Confirm',
          action: () => {
            setShowNotifGlobal({
              ...snowNotifGlobal,
              show: false,
            });
            setTimeout(() => {
              setShowNotifGlobal({
                show: false,
                title: '',
                type: '',
                message: '',
                confirmButtonText: '',
                action: () => {}
              });
              dispatch(defaultReservation());
            }, 1000)
          }
        })
      }

    }
  
  }, [reservationSlice]);

  useEffect(() => {
    let {
      isLoading,
      isError,
      isSuccess,
      data,
    } = settingSlice;

    if (!isLoading && isSuccess) {
      dispatch(defaultSetting());
      if (data?.status === 1) {
        setShowUnvailable(true);
        setShowLoader(false);
      } else {
        dispatch(getCommentList());
      }
    }

    if(!isLoading && isError) {
      dispatch(defaultSetting());
      setShowUnvailable(true);
      setShowLoader(false);
    }

  }, [settingSlice]);

  useEffect(() => {
    let {
      isLoading,
      isError,
      isSuccess,
      data,
    } = commentSlice;

    if (!isLoading && isSuccess) {
      dispatch(defaultCommentList());
      setShowLoader(false);
      setShowEnvelope(true);
      if (data?.length > 0) {
        let result = getListComment(data);
        setDataComment(result);
      }
    }

    if (!isLoading && isError) {
      setShowLoader(false);
      setShowNotifGlobal({
        show: true,
        title: 'Get Comment List ',
        type: 'warning',
        message: commentSlice?.message,
        confirmButtonText: 'Confirm',
        action: () => {
          dispatch(defaultCommentList());
          setShowNotifGlobal({
            ...snowNotifGlobal,
            show: false,
          });
          setTimeout(() => {
            setShowNotifGlobal({
              show: false,
              title: '',
              type: '',
              message: '',
              confirmButtonText: '',
              action: () => {}
            });
          }, 500);
        }
      })
    }

  }, [commentSlice])

  const getListComment = (data) => {
    let result = [];
    data?.map((item) => {
      result.push({
          name: item?.name,
          date: moment(item?.created_at).format('MMMM DD, YYYY'),
          comment: item?.comment,
        })
      return item;
    });
    return result;
  }

  const renderListError = () => {
    let errorField = '';
    let { data } = reservationSlice;
    if (data?.errors && data?.errors?.length > 0) {
      let totalError = data?.errors?.length;
      data?.errors?.map((item, index) => {
        if ((index+1) >= totalError) {
          errorField = `${errorField}<span class="text-xs">${item?.message}</span>`;
        } else {
          errorField = `${errorField}<span class="text-xs">${item?.message}</span><br class="hidden" />`;
        }
        return item;
      });
    }
    return errorField;
  }

  const updateActiveMenu = () => {
    let { position } = windowDimensions;
    if (homeRef?.current) {
      listMenu?.map((item) => {
        let currentRef = item?.ref
        let nextRef = item?.nextRef;
        if (nextRef) {
          if (position >= currentRef?.current?.offsetTop-0.5 && position < nextRef?.current?.offsetTop) {
            setActiveMenu(item?.slug);
          }
        } else {
          if (position >= currentRef?.current?.offsetTop-0.5) {
            setActiveMenu(item?.slug);
          }
        }
        return item;
      })
    }
  }

  const submitReservationForm = () => {
    if (!reservationSlice?.isLoading) {
      dispatch(submitReservation(dataForm));
    }
  }

  return (
    <div
      ref={scrollRef}
      className="w-full min-h-screen h-screen relative scroll-smooth overflow-x-hidden hide-scroll"
      onScroll={_.debounce(() => {
        if (windowDimensions.width <= 1024) setShowMenu(false);
        setWindowDimensions({
          ...windowDimensions,
          position: scrollRef?.current?.scrollTop,
        });
      }, 300)}
    >
      <ImageModal
        show={imageModal?.show}
        data={imageModal?.data}
        onClose={() => setImageModal({show: false, data: null})}
        windowDimensions={windowDimensions}
      />

      <Loader
        show={showLoader}
        windowDimensions={windowDimensions}
      />

      <NotAvailable
        show={showUnvailable}
        windowDimensions={windowDimensions}
      />

      <Envelope
        show={showEnvelope}
        windowDimensions={windowDimensions}
        onOpen={() => setPlayMusic(true)}
        name={name}
      />

      <Alert
        show={showSubmitForm}
        isLoading={reservationSlice?.isLoading}
        title={'Submit Form'}
        message={'<span className="w-full text-center">Apakah anda sudah yakin dengan data anda?</span>'}
        type={'question'}
        showCancelButton={true}
        cancelButtonText={"Tidak, Saya akan cek kembali"}
        cancelButtonAction={() => {
          setDataForm(null);
          setShowSubmitForm(false);
        }}
        confirmButtonText={'Ya, Saya sudah yakin'}
        confirmButtonAction={submitReservationForm}
        windowDimensions={windowDimensions}
      />

      <Alert
        show={snowNotifGlobal?.show}
        title={snowNotifGlobal?.title}
        message={snowNotifGlobal?.message}
        type={snowNotifGlobal?.type}
        showCancelButton={false}
        confirmButtonText={snowNotifGlobal?.confirmButtonText}
        confirmButtonAction={() => snowNotifGlobal?.action ? snowNotifGlobal?.action() : {}}
        windowDimensions={windowDimensions}
      />

      <Alert
        show={showCopyText}
        title={'Copy QR URL'}
        message={'<div className="w-full flex items-center justify-center text-center">Berhasil copy link QR Code</div>'}
        type={'success'}
        showCancelButton={false}
        confirmButtonAction={() => setShowCopyText(false)}
        windowDimensions={windowDimensions}
      />

      <Menu
        active={activeMenu}
        show={showMenu}
        windowDimensions={windowDimensions}
        listMenu={listMenu}
        offSetHideMenuDesktopSize={offSetHideMenuDesktopSize}
        desktopSize={desktopSize}
        onClickMenu={(menu) => {
          setActiveMenu(menu);
        }}
        onShowMenu={(status) => setShowMenu(status)}
      />

      <ScrollToTop
        show={showToTop}
        onScrollToTop={() => {
          homeRef?.current?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      <MusicPlayer
        firstPlay={playMusic}
      />

      <HomeSection
        ref={homeRef}
        data={settingSlice?.data}
        onClickDown={() => aboutUsRef?.current?.scrollIntoView({ behavior: 'smooth' })}
        onShowModalImage={(data) => setImageModal({show: true, data: data})}
      />

      <AboutUsSection
        ref={aboutUsRef}
        data={settingSlice?.data}
        onShowModalImage={(data) => setImageModal({show: true, data: data})}
      />

      <OurStorySection
        ref={ourStoryRef}
        data={settingSlice?.data}
        onShowModalImage={(data) => setImageModal({show: true, data: data})}
      />

      <EventsSection
        ref={eventsRef}
        data={settingSlice?.data}
        date={formatDateCoundown(settingSlice?.data?.event_ceremonial_date, settingSlice?.data?.event_ceremonial_start_time)}
     />

      <BridesmaidsGroomsmanSection
        ref={bridesmaidsGroomsmanRef}
        data={settingSlice?.data}
        onShowModalImage={(data) => setImageModal({show: true, data: data})}
      />

      <GallerySection
        ref={galleryRef}
        data={settingSlice?.data}
        onShowModalImage={(data) => setImageModal({show: true, data: data})}
      />

      <ReservationSection
        ref={reservationRef}
        data={settingSlice?.data}
        name={name}
        onSubmit={(data) => {
          if (!data?.isError) {
            setDataForm(data?.data);
            setShowSubmitForm(true);
          }
        }}
      />

      <CommentSection
        data={dataComment}
      />

      <EndSection
        ref={endRef}
        data={settingSlice?.data}
      />

      <Footer />

    </div>
  );
};

export default Home;
