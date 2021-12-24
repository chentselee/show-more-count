import { useState, useRef, useEffect } from 'react';

const items = ['aaaaaaaa', 'bbbbbbbbbb', 'cccccc'];

function App() {
  const [parentWidth, setParentWidth] = useState(200);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const childrenRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [shownChildren, setShownChildren] = useState<Record<string, boolean>>(
    () => items.reduce((accu, current) => ({ ...accu, [current]: true }), {})
  );

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        setShownChildren((prev) =>
          entries.reduce(
            (accu, current) => ({
              ...accu,
              [current.target.textContent ?? '']: current.isIntersecting,
            }),
            prev
          )
        );
      },
      { threshold: 1 }
    );

    childrenRefs.current.forEach((childRef) => {
      if (childRef) {
        intersectionObserver.observe(childRef);
      }
    });

    return () => {
      intersectionObserver.disconnect();
    };
  }, []);

  const hiddenChildrenCount = Object.values(shownChildren).filter(
    (item) => !item
  ).length;

  return (
    <div style={{ position: 'relative' }}>
      {/* The ACTUAL items being observed */}
      <div
        style={{
          opacity: 0,
          userSelect: 'none',
          position: 'absolute',
        }}
      >
        <div
          ref={parentRef}
          style={{
            maxWidth: parentWidth,
            overflow: 'hidden',
            display: 'flex',
            gap: 16,
            border: '1px solid blue',
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              ref={(ref) => {
                childrenRefs.current[index] = ref;
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div
          style={{
            maxWidth: parentWidth,
            overflow: 'hidden',
            display: 'flex',
            gap: 16,
            border: '1px solid blue',
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: shownChildren[item] ? 'block' : 'none',
              }}
            >
              {item}
            </div>
          ))}
        </div>
        {hiddenChildrenCount !== 0 && <div>{hiddenChildrenCount}+</div>}
      </div>
      <label
        htmlFor="width"
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        Width
        <span>{parentWidth}px</span>
      </label>
      <input
        id="width"
        type="range"
        max="300"
        min="10"
        step="10"
        value={parentWidth}
        onChange={(e) => setParentWidth(+e.target.value)}
      />
    </div>
  );
}

export default App;
