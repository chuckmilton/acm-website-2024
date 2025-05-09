"use client";

import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Modal from 'react-modal';
import Image from 'next/image';

const localizer = momentLocalizer(moment);

export default function Events() {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        const formattedEvents = data.map(event => ({
          ...event,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          allDay: event.allDay || false,
          eventLocation: event.eventLocation || 'CSULB',
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    if (!modalIsOpen) {
      setSelectedEvent(event);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  // Ensure that the app element is set properly for react-modal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('#__next');
    }
  }, []);

  const goToNext = () => {
    const newDate = moment(date).add(1, currentView === Views.MONTH || currentView === Views.AGENDA ? 'month' : currentView === Views.WEEK ? 'week' : 'day').toDate();
    setDate(newDate);
  };

  const goToBack = () => {
    const newDate = moment(date).subtract(1, currentView === Views.MONTH || currentView === Views.AGENDA ? 'month' : currentView === Views.WEEK ? 'week' : 'day').toDate();
    setDate(newDate);
  };

  const goToToday = () => {
    setDate(new Date());
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header with Animated Background */}
      <div className="relative area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>

        <motion.section
          className="relative z-10 text-white py-20 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto">
            <h1 className="text-5xl font-extrabold">Upcoming Events</h1>
            <p className="text-xl mt-4">Explore our upcoming workshops, hackathons, and networking events!</p>
          </div>
        </motion.section>
      </div>
      <div className="container mx-auto py-4 pt-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
  {/* Navigation Buttons */}
  <div className="flex flex-nowrap justify-center md:justify-start space-x-4">
    <motion.button
      className="bg-acm-blue text-white px-4 py-2 text-sm md:text-base rounded-lg font-bold"
      onClick={goToBack}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      Back
    </motion.button>
    <motion.button
      className="bg-acm-blue text-white px-4 py-2 text-sm md:text-base rounded-lg font-bold"
      onClick={goToToday}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      Today
    </motion.button>
    <motion.button
      className="bg-acm-blue text-white px-4 py-2 text-sm md:text-base rounded-lg font-bold"
      onClick={goToNext}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      Next
    </motion.button>
  </div>

  {/* Month Title */}
  <div className="text-center">
    <span className="block text-black font-bold text-2xl md:text-3xl lg:text-5xl">
      {moment(date).format('MMMM YYYY')}
    </span>
  </div>

  {/* View Buttons */}
  <div className="flex flex-nowrap justify-center md:justify-end space-x-4">
    <motion.button
      className="bg-acm-blue text-white px-4 py-2 text-sm md:text-base rounded-lg font-bold"
      onClick={() => setCurrentView(Views.MONTH)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      Month
    </motion.button>
    <motion.button
      className="bg-acm-blue text-white px-4 py-2 text-sm md:text-base rounded-lg font-bold"
      onClick={() => setCurrentView(Views.WEEK)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      Week
    </motion.button>
    <motion.button
      className="bg-acm-blue text-white px-4 py-2 text-sm md:text-base rounded-lg font-bold"
      onClick={() => setCurrentView(Views.DAY)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      Day
    </motion.button>
    <motion.button
      className="bg-acm-blue text-white px-4 py-2 text-sm md:text-base rounded-lg font-bold"
      onClick={() => setCurrentView(Views.AGENDA)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      Agenda
    </motion.button>
  </div>
</div>



    {/* Calendar Section */}
    <motion.section
      className="container mx-auto pb-16 px-6 md:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
        <div className="min-w-[1200px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            className="rounded-lg shadow-lg text-gray-800 mt-4"
            onSelectEvent={handleEventClick}
            view={currentView}
            onView={(view) => setCurrentView(view)}
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
            views={['month', 'week', 'day', 'agenda']}
            toolbar={false}
            popup={true}
          />
        </div>
      </div>
    </motion.section>

      {/* Event Modal */}
      {selectedEvent && modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Event Details"
          className="fixed inset-0 z-50 flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
          shouldCloseOnOverlayClick={true}
        >
          <motion.div
            className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {selectedEvent.image && (
              <Image
                src={selectedEvent.image}
                alt={selectedEvent.title}
                layout="responsive"
                width={800}
                height={400}
                className="rounded-md mb-4"
              />
            )}
            <h2 className="text-3xl font-bold mb-4 text-black text-center">
              {selectedEvent.title}
            </h2>

            <div
              className="text-gray-700 mb-4 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: selectedEvent.description || "No description provided.",
              }}
            ></div>

            <p className="text-gray-800 mb-4 text-center">
              <strong>Start Date:</strong>{" "}
              {moment(selectedEvent.start).format("MMMM Do, YYYY [at] h:mm A")}
              <br />
              {moment(selectedEvent.end).isSame(selectedEvent.start, "day") ? (
                <>
                  <strong>Time:</strong>{" "}
                  {moment(selectedEvent.start).format("h:mm A")} -{" "}
                  {moment(selectedEvent.end).format("h:mm A")}
                </>
              ) : (
                <>
                  <strong>End Date:</strong>{" "}
                  {moment(selectedEvent.end).format("MMMM Do, YYYY [at] h:mm A")}
                </>
              )}
              <br />
                <strong>Location:</strong>{" "}
                {selectedEvent.eventLocation || "No location provided."}
              </p>

            <div className="flex justify-center mt-6 space-x-4">
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                  selectedEvent.title
                )}&dates=${moment
                  .tz(selectedEvent.start, "America/Los_Angeles")
                  .utc()
                  .format("YYYYMMDDTHHmmss[Z]")}/${moment
                  .tz(selectedEvent.end, "America/Los_Angeles")
                  .utc()
                  .format("YYYYMMDDTHHmmss[Z]")}&details=${encodeURIComponent(
                  selectedEvent.description || "Event details not provided."
                )}&location=${encodeURIComponent(selectedEvent.eventLocation || "CSULB")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition"
              >
                Add to Google Calendar
              </a>
              <button
                onClick={closeModal}
                className="bg-gray-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </Modal>
      )}
    </div>
  );
}
