import React from "react";
import { TABS_KEYS, TABS } from "./TABS";
import { Event as EventBase } from "./Event";

const Event = React.memo(EventBase);

function HeroDashboard() {
  return (
    <section className="section main__general">
      <h2 className="section__title section__title-header section__main-title">
        Главное
      </h2>
      <div className="hero-dashboard">
        <div className="hero-dashboard__primary">
          <h3 className="hero-dashboard__title">Привет, Геннадий!</h3>
          <p className="hero-dashboard__subtitle">
            Двери и окна закрыты, сигнализация включена.
          </p>
          <ul className="hero-dashboard__info">
            <li className="hero-dashboard__item">
              <div className="hero-dashboard__item-title">Дома</div>
              <div className="hero-dashboard__item-details">
                +23
                <span className="a11y-hidden">°</span>
              </div>
            </li>
            <li className="hero-dashboard__item">
              <div className="hero-dashboard__item-title">За окном</div>
              <div className="hero-dashboard__item-details">
                +19
                <span className="a11y-hidden">°</span>
                <div
                  className="hero-dashboard__icon hero-dashboard__icon_rain"
                  role="img"
                  aria-label="Дождь"
                ></div>
              </div>
            </li>
          </ul>
        </div>
        <ul className="hero-dashboard__schedule">
          <Event
            icon="temp"
            iconLabel="Температура"
            title="Philips Cooler"
            subtitle="Начнет охлаждать в 16:30"
          />
          <Event
            icon="light"
            iconLabel="Освещение"
            title="Xiaomi Yeelight LED Smart Bulb"
            subtitle="Включится в 17:00"
          />
          <Event
            icon="light"
            iconLabel="Освещение"
            title="Xiaomi Yeelight LED Smart Bulb"
            subtitle="Включится в 17:00"
          />
        </ul>
      </div>
    </section>
  );
}

function FavoriteScripts() {
  return (
    <section className="section main__scripts">
      <h2 className="section__title section__title-header">
        Избранные сценарии
      </h2>
      <ul className="event-grid">
        <Event
          slim
          icon="light2"
          iconLabel="Освещение"
          title="Выключить весь свет в доме и во дворе"
        />
        <Event
          slim
          icon="schedule"
          iconLabel="Расписание"
          title="Я ухожу"
        />
        <Event
          slim
          icon="light2"
          iconLabel="Освещение"
          title="Включить свет в коридоре"
        />
        <Event
          slim
          icon="temp2"
          iconLabel="Температура"
          title="Набрать горячую ванну"
          subtitle="Начнётся в 18:00"
        />
        <Event
          slim
          icon="temp2"
          iconLabel="Температура"
          title="Сделать пол тёплым во всей квартире"
        />
      </ul>
    </section>
  );
}

function FavoriteDevices() {
  const panelRef = React.useRef(null);
  const resizeTimeoutRef = React.useRef(null);

  const [activeTab, setActiveTab] = React.useState(
    new URLSearchParams(location.search).get("tab") || "all"
  );
  const [hasRightScroll, setHasRightScroll] = React.useState(false);

  const checkOverflow = React.useCallback(() => {
    const panel = panelRef.current?.querySelector(
      ".section__panel:not(.section__panel_hidden)"
    );
    if (!panel) return;
    const { scrollWidth, clientWidth } = panel;
    setHasRightScroll(scrollWidth > clientWidth);
  }, []);

  React.useLayoutEffect(() => {
    checkOverflow();
  }, [activeTab, checkOverflow]);

  React.useEffect(() => {
    const handleResize = () => {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(checkOverflow, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkOverflow]);

  const onArrowClick = React.useCallback(() => {
    const scroller = panelRef.current?.querySelector(
      ".section__panel:not(.section__panel_hidden)"
    );
    if (scroller) {
      scroller.scrollTo({
        left: scroller.scrollLeft + 400,
        behavior: "smooth",
      });
    }
  }, []);

  const onSelectInput = React.useCallback((event) => {
    setActiveTab(event.target.value);
  }, []);

  // Memoized tab content (DOM preserved)
  const tabPanelContent = React.useMemo(() => {
    const content = {};
    for (const key of TABS_KEYS) {
      content[key] = TABS[key].items.map((item, index) => (
        <Event key={index} {...item} />
      ));
    }
    return content;
  }, []);

  return (
    <section className="section main__devices">
      <div className="section__title">
        <h2 className="section__title-header">Избранные устройства</h2>
        <select
          className="section__select"
          value={activeTab}
          onChange={onSelectInput}
        >
          {TABS_KEYS.map((key) => (
            <option key={key} value={key}>
              {TABS[key].title}
            </option>
          ))}
        </select>
        <ul role="tablist" className="section__tabs">
          {TABS_KEYS.map((key) => (
            <li
              key={key}
              role="tab"
              aria-selected={key === activeTab}
              tabIndex={key === activeTab ? "0" : undefined}
              className={
                "section__tab" +
                (key === activeTab ? " section__tab_active" : "")
              }
              id={`tab_${key}`}
              aria-controls={`panel_${key}`}
              onClick={() => setActiveTab(key)}
            >
              {TABS[key].title}
            </li>
          ))}
        </ul>
      </div>

      <div className="section__panel-wrapper" ref={panelRef}>
        {TABS_KEYS.map((key) => (
          <div
            key={key}
            role="tabpanel"
            className={
              "section__panel" +
              (key === activeTab ? "" : " section__panel_hidden")
            }
            aria-hidden={key !== activeTab}
            id={`panel_${key}`}
            aria-labelledby={`tab_${key}`}
          >
            <ul className="section__panel-list">{tabPanelContent[key]}</ul>
          </div>
        ))}
        {hasRightScroll && (
          <div className="section__arrow" onClick={onArrowClick}></div>
        )}
      </div>
    </section>
  );
}


export function MainComponent() {
  return (
    <main className="main">
      <HeroDashboard />
      <FavoriteScripts />
      <FavoriteDevices />
    </main>
  );
}
