import { EventType } from 'core/common';
import { BehaviorInfoUploader } from 'types/uploader';
import { VisitInfo } from 'types/userBehavior';
import { createlistener, removeListener } from 'utils/eventHandler';
import { getTimestamp } from 'utils/timestampHandler';

const { load } = EventType;

export const initPV = (upload: BehaviorInfoUploader) => {
  const getVisitType = () => {
    // TODO no alternative has been found for the time being
    const nvg = window.performance.navigation;
    if (nvg) {
      const { type, TYPE_NAVIGATE, TYPE_RELOAD, TYPE_BACK_FORWARD } = nvg;

      switch (type) {
        case TYPE_NAVIGATE:
          return 'normal';
        case TYPE_RELOAD:
          return 'reload';
        case TYPE_BACK_FORWARD:
          return 'back-forward';
      }
    }

    return 'other';
  };

  const handler = () => {
    const visitInfo: VisitInfo = {
      time: getTimestamp(),
      origin: document.referrer,
      type: getVisitType()
    };

    // upload the visit information immediately
    upload(visitInfo);

    // remove this event listener while visit information has uplaoded
    removeListener(load, handler, { once: true, capture: true });
  };

  createlistener(load)(handler, { once: true, capture: true });
};