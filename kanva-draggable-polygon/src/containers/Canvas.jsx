import React, { useMemo, useRef, useState, useEffect } from "react";
import PolygonAnnotation from "components/PolygonAnnotation";
// CircleAnnotation은 나중에 추가될 컴포넌트로 가정
import { Stage, Layer, Image } from "react-konva";
import Button from "components/Button";
import ImageUpload from "components/ImageUpload"; // 이미지 업로드 컴포넌트 가져오기

const wrapperStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: 20,
  backgroundColor: "aliceblue",
};
const columnStyle = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 20,
  backgroundColor: "aliceblue",
};

const Canvas = () => {
  const [image, setImage] = useState(); // 업로드된 이미지 저장
  const [message, setMessage] = useState(''); // LLM에 보낼 메시지 상태
  const imageRef = useRef(null);
  const dataRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [size, setSize] = useState({});
  const [flattenedPoints, setFlattenedPoints] = useState();
  const [position, setPosition] = useState([0, 0]);
  const [isMouseOverPoint, setMouseOverPoint] = useState(false);
  const [isPolyComplete, setPolyComplete] = useState(false);


  // 이미지 업로드 콜백 함수
  const handleImageUpload = (uploadedImage) => {
    const img = new window.Image();
    img.src = uploadedImage;
    img.onload = () => {
      setSize({
        width: img.width,
        height: img.height,
      });
      setImage(img);
      imageRef.current = img;
    };
  };

  const getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };

  const handleMouseDown = (e) => {
    if (isPolyComplete) return;
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    if (isMouseOverPoint && points.length >= 3) {
      setPolyComplete(true);
    } else {
      setPoints([...points, mousePos]);
    }
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    setPosition(mousePos);
  };

  const handleMouseOverStartPoint = (e) => {
    if (isPolyComplete || points.length < 3) return;
    e.target.scale({ x: 3, y: 3 });
    setMouseOverPoint(true);
  };

  const handleMouseOutStartPoint = (e) => {
    e.target.scale({ x: 1, y: 1 });
    setMouseOverPoint(false);
  };

  const handlePointDragMove = (e) => {
    const stage = e.target.getStage();
    const index = e.target.index - 1;
    const pos = [e.target._lastPos.x, e.target._lastPos.y];
    if (pos[0] < 0) pos[0] = 0;
    if (pos[1] < 0) pos[1] = 0;
    if (pos[0] > stage.width()) pos[0] = stage.width();
    if (pos[1] > stage.height()) pos[1] = stage.height();
    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
  };

  useEffect(() => {
    setFlattenedPoints(
      points
        .concat(isPolyComplete ? [] : position)
        .reduce((a, b) => a.concat(b), [])
    );
  }, [points, isPolyComplete, position]);

  const undo = () => {
    setPoints(points.slice(0, -1));
    setPolyComplete(false);
    setPosition(points[points.length - 1]);
  };

  const reset = () => {
    setPoints([]);
    setPolyComplete(false);
  };

  const handleGroupDragEnd = (e) => {
    if (e.target.name() === "polygon") {
      let result = [];
      let copyPoints = [...points];
      copyPoints.map((point) =>
        result.push([point[0] + e.target.x(), point[1] + e.target.y()])
      );
      e.target.position({ x: 0, y: 0 });
      setPoints(result);
    }
  };

  // 프롬프트 메시지 전송 처리 함수
  const handleSendMessage = () => {
    if (message.trim() === "") return;
    console.log("LLM으로 보낼 메시지:", message);
    // 여기서 실제 LLM API 호출 또는 처리 작업 수행
    setMessage(''); // 메시지 전송 후 입력 필드 초기화
  };

  return (
    <div style={wrapperStyle}>
      <div style={columnStyle}>
        {/* 이미지 업로드 컴포넌트 */}
        <ImageUpload onImageUpload={handleImageUpload} />

        <Stage
          width={size.width || 650}
          height={size.height || 302}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
        >
          <Layer>
            {/* 업로드된 이미지가 렌더링 */}
            <Image
              ref={imageRef}
              image={image}
              x={0}
              y={0}
              width={size.width}
              height={size.height}
            />
            <PolygonAnnotation
              points={points}
              flattenedPoints={flattenedPoints}
              handlePointDragMove={handlePointDragMove}
              handleGroupDragEnd={handleGroupDragEnd}
              handleMouseOverStartPoint={handleMouseOverStartPoint}
              handleMouseOutStartPoint={handleMouseOutStartPoint}
              isFinished={isPolyComplete}
            />
          </Layer>
        </Stage>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button name="Undo" onClick={undo} />
          <Button name="Reset" onClick={reset} />
        </div>

        {/* 프롬프트 메시지를 입력하는 채팅 창 */}
        <div style={{ marginTop: '20px' }}>
          <textarea
            style={{ width: '300px', height: '100px', marginBottom: '10px' }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter Request Message To AI!"
          />
          <br />
          <Button name="Send Message" onClick={handleSendMessage} />
        </div>
      </div>

      <div ref={dataRef} style={{
        width: 375,
        height: 302,
        boxShadow: ".5px .5px 5px .4em rgba(0,0,0,.1)",
        marginTop: 20
      }}>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(points)}</pre>
      </div>
    </div>
  );
};

export default Canvas;
