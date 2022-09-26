export type ChangeEvent = Event & {
	currentTarget: EventTarget & HTMLInputElement;
};
