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