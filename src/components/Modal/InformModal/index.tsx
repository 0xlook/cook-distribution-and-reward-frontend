import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { Row, Col } from 'react-grid-system';
import ActionButton from "../../common/ActionButton";

interface Props {
  visible: boolean;
  text?: string;
  onClose: () => void;
}

export const InformModal: React.FC<Props> = ({ visible, onClose, text }) => {

  return (
    <>
      <Modal isOpen={visible} onRequestClose={() => onClose()}
        className="Modal" overlayClassName="Overlay" style={{ zIndex: 1000 }}>
        <Row justify="center">
          <Title>
            {text}
          </Title>
        </Row>
        <Row justify="center">
          <Col xs={6} style={{ textAlign: "center" }}>
            <ActionButton
              type="filled"
              label="Ok"
              onClick={onClose}
              disabled={false}
            />
          </Col>
        </Row>
      </Modal>

    </>
  );
}

const Title = styled.div`
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
  text-align: center;
`
