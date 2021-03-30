import { TransactionProgressModal, InformModal } from "components/Modal";
import React, { useState } from "react";

export interface IGlobalData {
  transactionModalInfo: {
    visible: boolean;
    txId: string;
    description?: string;
    title?: string;
  };
  informModalInfo: {
    visible: boolean;
    text?: string;
  };
}

const GlobalContext = React.createContext<
  IGlobalData & {
    setTransactionModalVisible: (
      visible: boolean,
      txId?: string,
      description?: string
    ) => void;
    setInformModalVisible: (
      visible: boolean,
      text?: string,
    ) => void;

  }
>({
  transactionModalInfo: {
    visible: false,
    txId: "",
  },
  informModalInfo: {
    visible: false,
    text: ""
  },
  setTransactionModalVisible: (_: boolean) => { },
  setInformModalVisible: (_: boolean) => { },
});

export const useGlobal = () => {
  const context = React.useContext(GlobalContext);

  if (!context) {
    throw new Error("Component rendered outside the provider tree");
  }

  return context;
};

export const GlobalProvider: React.FC = (props) => {
  const [state, setState] = useState<IGlobalData>({
    transactionModalInfo: {
      visible: false,
      txId: "",
    },
    informModalInfo: {
      visible: false,
      text: ""
    },
  });

  const setTransactionModalVisible = (
    visible: boolean,
    txId?: string,
    description?: string
  ) => {
    setState((prev) => ({
      ...prev,
      transactionModalInfo: {
        visible,
        txId: txId || "",
        description,
      },
    }));
  };

  const setInformModalVisible = (
    visible: boolean,
    text?: string
  ) => {
    setState((prev) => ({
      ...prev,
      informModalInfo: {
        visible,
        text,
      },
    }));
  };

  return (
    <GlobalContext.Provider value={{ ...state, setTransactionModalVisible, setInformModalVisible }}>
      {props.children}
      {state.transactionModalInfo.visible && (
        <TransactionProgressModal
          {...state.transactionModalInfo}
          onClose={() => {
            setTransactionModalVisible(false);
          }}
        />
      )}
      <InformModal
        {...state.informModalInfo}
        onClose={() => {
          setInformModalVisible(false, "");
        }}
      />
    </GlobalContext.Provider>
  );
};
