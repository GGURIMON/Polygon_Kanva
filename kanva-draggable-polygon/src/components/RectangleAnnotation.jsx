import React, { useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';

const RectangleAnnotation = () => {
    const [rectProps, setRectProps] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const [isDrawing, setIsDrawing] = useState(false);
    const [corners, setCorners] = useState({
        topLeft: { x: 0, y: 0 },
        topRight: { x: 0, y: 0 },
        bottomLeft: { x: 0, y: 0 },
        bottomRight: { x: 0, y: 0 },
    });

    const handleMouseDown = (e) => {
        const stage = e.target.getStage();
        const { x, y } = stage.getPointerPosition();
        setRectProps({
            x: x,
            y: y,
            width: 0,
            height: 0,
        });
        setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;

        const stage = e.target.getStage();
        const { x, y } = stage.getPointerPosition();
        const newWidth = x - rectProps.x;
        const newHeight = y - rectProps.y;

        setRectProps((prevRect) => ({
            ...prevRect,
            width: newWidth,
            height: newHeight,
        }));

        setCorners({
            topLeft: { x: rectProps.x, y: rectProps.y },
            topRight: { x: rectProps.x + newWidth, y: rectProps.y },
            bottomLeft: { x: rectProps.x, y: rectProps.y + newHeight },
            bottomRight: { x: rectProps.x + newWidth, y: rectProps.y + newHeight },
        });
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    return (
        <div>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <Layer>
                    <Rect
                        x={rectProps.x}
                        y={rectProps.y}
                        width={rectProps.width}
                        height={rectProps.height}
                        fill="rgba(0, 0, 255, 0.3)"
                        stroke="blue"
                        strokeWidth={2}
                    />
                    {/* 각 모서리에 좌표값 표시 */}
                    <Text
                        x={corners.topLeft.x - 50}
                        y={corners.topLeft.y - 20}
                        text={`Top Left: (${corners.topLeft.x.toFixed(2)}, ${corners.topLeft.y.toFixed(2)})`}
                        fontSize={12}
                        fill="black"
                    />
                    <Text
                        x={corners.topRight.x}
                        y={corners.topRight.y - 20}
                        text={`Top Right: (${corners.topRight.x.toFixed(2)}, ${corners.topRight.y.toFixed(2)})`}
                        fontSize={12}
                        fill="black"
                    />
                    <Text
                        x={corners.bottomLeft.x - 50}
                        y={corners.bottomLeft.y}
                        text={`Bottom Left: (${corners.bottomLeft.x.toFixed(2)}, ${corners.bottomLeft.y.toFixed(2)})`}
                        fontSize={12}
                        fill="black"
                    />
                    <Text
                        x={corners.bottomRight.x}
                        y={corners.bottomRight.y}
                        text={`Bottom Right: (${corners.bottomRight.x.toFixed(2)}, ${corners.bottomRight.y.toFixed(2)})`}
                        fontSize={12}
                        fill="black"
                    />
                </Layer>
            </Stage>
        </div>
    );
};

export default RectangleAnnotation;
