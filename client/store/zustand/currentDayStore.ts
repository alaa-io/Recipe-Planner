import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";

type CurrentDayStore = {
  today: Date;
  setToday: (state: Date) => void;
};
type MyPersist = (
  config: StateCreator<CurrentDayStore>,
  options: PersistOptions<CurrentDayStore>
) => StateCreator<CurrentDayStore>;

export const useCurrentDayStore = create<CurrentDayStore, []>(
  (persist as MyPersist)(
    (set): CurrentDayStore => ({
      today: new Date(),
      setToday: (state: Date) => set({ today: state }),
    }),

    {
      name: "currentDay-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const selectCurrentDayState = (state: CurrentDayStore) => state.today;
