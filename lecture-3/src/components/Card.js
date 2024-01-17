import React from "react";
import { useEffect } from "react";
import { useRef } from "react";

function Card(props) {
  const imgRef = useRef(null);

  useEffect(() => {
    const options = {};
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sourceEl = entry.target.previousSibling;
          sourceEl.srcset = sourceEl.dataset.srcset;
          entry.target.src = entry.target.dataset.src; // src에 값을 할당함으로써 이미지를 로드한다.
          observer.unobserve(entry.target); // 이미지를 로드한 이후에는 관찰을 중지한다.
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="Card text-center">
      <picture>
        <source data-srcset={props.webp} type="image/webp" />
        <img data-src={props.image} ref={imgRef} />
      </picture>
      <div className="p-5 font-semibold text-gray-700 text-xl md:text-lg lg:text-xl keep-all">{props.children}</div>
    </div>
  );
}

export default Card;
