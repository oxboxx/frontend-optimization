import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import LazyLoad from 'react-lazyload';
import { setBgColor, showModal } from '../redux/imageModal';
import { getAverageColorOfImage } from '../utils/getAverageColorOfImage';

function PhotoItem({ photo: { urls, alt } }) {
  const dispatch = useDispatch();

  const openModal = e => {
    dispatch(showModal({ src: urls.full, alt }));

    const averageColor = getAverageColorOfImage(e.target);
    dispatch(setBgColor(averageColor));
  };

  return (
    <ImageWrap>
      <LazyLoad offset={1000}>
        <Image
          src={urls.small + '&t=' + new Date().getTime()}
          alt={alt}
          onClick={openModal}
          crossOrigin="*"
        />
      </LazyLoad>
    </ImageWrap>
  );
}

const ImageWrap = styled.div`
  /* 너비는 상위 컴포넌트인 PhotoList 컴포넌트에서 정의됨 */
  width: 100%;
  padding-top: 56.25%;
  position: relative;
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
`;

export default PhotoItem;
