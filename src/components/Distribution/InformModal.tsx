import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { Row, Col } from 'react-grid-system';
import ActionButton from "../common/ActionButton";

interface Props {
  isOpen: boolean;
  close: () => void;
}

const InformModal: React.FC<Props> = ({ isOpen, close }) => {

  return (
    <>
      <Modal isOpen={isOpen} onRequestClose={() => close()}
          className="Modal" overlayClassName="Overlay">
        <Row justify="center">
          <Title>
            Please select the pool to zap
          </Title>
        </Row>
        <Row justify="center">
          <Col xs={6} style={{ textAlign: "center" }}>
              <ActionButton
                type="filled"
                label="Ok"
                onClick={close}
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

export default InformModal;