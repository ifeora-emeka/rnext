import {rNextDataType} from '@idegin/rnext/types';
import {
    AlignJustify,
    AlignLeft,
    Calendar,
    Hash,
    Image,
    MinusIcon,
    AudioWaveform,
    FileIcon, Clapperboard, ToggleLeft
} from "lucide-react";

export default function DataTypeIcon({type, className}: {
    type: rNextDataType,
    className?: string
}) {
    const IconComponent = (() => {
        switch (type) {
            case rNextDataType.RICH_TEXT:
                return AlignJustify;
            case rNextDataType.SHORT_TEXT:
            case rNextDataType.LONG_TEXT:
                return AlignLeft;
            case rNextDataType.NUMBER:
                return Hash;
            case rNextDataType.TIMESTAMP:
                return Calendar;
            case rNextDataType.IMAGE:
                return Image;
            case rNextDataType.AUDIO:
                return AudioWaveform;
            case rNextDataType.DOCUMENT:
                return FileIcon;
            case rNextDataType.BOOLEAN:
                return ToggleLeft;
            case rNextDataType.VIDEO:
                return Clapperboard;
            default:
                return MinusIcon;
        }
    })();

    return <IconComponent className={className}/>;
}