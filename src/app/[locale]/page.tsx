"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
    Button,
    Card,
    Checkbox,
    ColorPicker,
    Input,
    Menu,
    Modal,
    Slider,
    TabsProps,
    Typography,
    message,
    Image,
} from "antd";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
const DraggableElement = dynamic(
    () => import("../../components/dnd_tools/DraggableElement"),
    { ssr: false }
);

import { Color } from "antd/es/color-picker";
import Slides from "@/components/Slides";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import ExportPptxButton from "@/components/ExportPptxButton";
import { updateSlideDeck } from "@/lib/slidesSlice";
import LastMenu from "@/components/lastmenu";
import DraggableItem from "@/components/dnd_tools/DraggableItem";
import AddText from "@/components/topmenu/AddText";
import AddImage from "@/components/topmenu/AddImage";
import AddBackground from "@/components/topmenu/AddBackground";
import { setElements } from "@/lib/slideElementSlice";
import TopToolbar from "@/components/topmenu/TopToolbar";
const { Title } = Typography;

export default function HomePage() {
    const dispatch = useDispatch();
    const slides = useSelector((state: RootState) => state.slides);
    const elements = useSelector((state: RootState) => state.sliceElements);

    useEffect(() => {
        if ((elements.length === 0 || !elements) && slides.length > 0) {
            dispatch(setElements(slides[0].data ?? []));
        }
    }, []);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(
        null
    );

    const selectedSlide = useSelector((state: RootState) =>
        state.slides.find((sl) => sl.selected)
    );

    const backgroundColor = selectedSlide?.backgroundColor ?? '#ffffff';
    const backgroundImage = selectedSlide?.backgroundImage ?? '';

    const [mode, setMode] = useState<"move" | "resize">("move");
    const elementRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        const newElements = elements.map((el) =>
            el.id === active.id
                ? { ...el, x: el.x + delta.x, y: el.y + delta.y }
                : el
        );

        dispatch(setElements(newElements));
    };
    // 👇 Lắng nghe phím 'm' và 'r'
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "m") setMode("move");
            if (e.key === "r") setMode("resize");
            if (e.key === "Escape") setSelectedElementId(null);
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);
    // update element when selected slice changed
    useEffect(() => {
        //      setElements(slides.find((sl) => sl.selected)?.data || [])
        setSelectedElementId(null);
    }, [slides]);
    // update slice when element change
    useEffect(() => {
        const index = slides.findIndex((sl) => sl.selected);
        if (index !== -1) {
            const updated = { ...slides[index], data: elements };
            dispatch(updateSlideDeck({ index, deck: updated }));
        }
    }, [elements]);

    const [dropped, setDropped] = useState(false);
    return (
        <Card>
            <TopToolbar mode={mode} onModeChange={setMode} />
            <DndContext onDragEnd={handleDragEnd}>

                <div className="flex gap-2">
                    <div
                        style={{
                            width: 960,
                            height: 540,
                            border: "1px solid #ccc",
                            marginBottom: 20,
                            overflow: "hidden",
                            position: "relative",
                            backgroundColor: backgroundColor,
                            backgroundImage: backgroundImage
                                ? `url(${backgroundImage})`
                                : undefined, // ✅ Added
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: 8,
                        }}
                    >
                        {elements.map((el) => (
                            <DraggableElement
                                key={el.id}
                                {...el}
                                selected={el.id === selectedElementId}
                                setRef={(node) =>
                                    (elementRefs.current[el.id] = node)
                                }
                                onClick={() => setSelectedElementId(el.id)}
                                mode={mode}
                            />
                        ))}
                    </div>
                    <Card style={{ marginBottom: 20 }}>
                        <LastMenu />
                    </Card>
                </div>
            </DndContext>
            <div className="mb-1">
                <ExportPptxButton
                    elements={elements}
                    background={
                        backgroundImage ? backgroundImage : backgroundColor
                    }
                />
            </div>
        </Card>
    );
}
