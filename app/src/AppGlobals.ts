export enum AppDialogs {
	NONE,
	AUTH,
	SHARE,
	TAGS,
	TASK,
}

export interface AppDialogProps {
	isVisible: boolean;
	hide: () => void;
}

export enum AppFilterDone {
	ALL = "ALL",
	NOT_DONE = "NOT_DONE",
	DONE = "DONE",
}