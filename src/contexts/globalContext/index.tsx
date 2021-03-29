import { TransactionProgressModal } from "components/Modal";
import React, { useState } from "react";

export interface IGlobalData {
  transactionModalInfo: {
    visible: boolean;
    txId: string;
    description?: string;
    title?: string;
  };
}

const GlobalContext = React.createContext<
  IGlobalData & {
    setTransactionModalVisible: (
      visible: boolean,
      txId?: string,
      description?: string
    ) => void;
  }
>({
  transactionModalInfo: {
    visible: false,
    txId: "",
  },
  setTransactionModalVisible: (_: boolean) => {},
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

  return (
    <GlobalContext.Provider value={{ ...state, setTransactionModalVisible }}>
      {props.children}
      {state.transactionModalInfo.visible && (
        <TransactionProgressModal
          {...state.transactionModalInfo}
          onClose={() => {
            setTransactionModalVisible(false);
          }}
        />
      )}
    </GlobalContext.Provider>
  );
};
