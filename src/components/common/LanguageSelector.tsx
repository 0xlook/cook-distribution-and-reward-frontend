import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import colors from '../../constants/colors';
import { useTranslation } from "react-i18next";
import { DropDown } from '@aragon/ui'

function LanguageSelector() {
  const languages = [
    { key: 'en', label: 'English' },
    { key: 'cn', label: '简体中文' },
    { key: 'zh', label: '繁體中文' }]
  const [lng, setLanguage] = useState(0);
  const { t, i18n } = useTranslation()

  useEffect(() => {
    i18n.changeLanguage(languages[lng].key)
  }, [lng]);


  return (
    <DropDown
      items={_.map(languages, 'label')}
      selected={lng}
      onChange={setLanguage}
    />
  );
}


export default LanguageSelector;
