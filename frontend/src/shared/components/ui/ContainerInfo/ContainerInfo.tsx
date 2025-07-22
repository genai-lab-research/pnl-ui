import * as React from 'react';
import { ContainerInfoProps } from './types';
import {
  Container,
  Section,
  SectionWithBorder,
  SectionTitle,
  FieldsContainer,
  LabelsColumn,
  ValuesColumn,
  Label,
  Value,
  StatusBadge,
  StatusText,
  TypeContainer,
  IconContainer,
  SeedTypes,
  Notes
} from './ContainerInfo.styles';

const ContainerInfo: React.FC<ContainerInfoProps> = ({
  name,
  type,
  tenant,
  purpose,
  location,
  status,
  created,
  lastModified,
  creator,
  seedTypes,
  notes
}) => {
  return (
    <Container>
      <SectionWithBorder>
        <SectionTitle>Container Information</SectionTitle>
        <FieldsContainer>
          <LabelsColumn>
            <Label>Name</Label>
            <Label>Type</Label>
            <Label>Tenant</Label>
            <Label>Purpose</Label>
            <Label>Location</Label>
            <Label>Status</Label>
            <Label>Created</Label>
            <Label>Last Modified</Label>
            <Label>Creator</Label>
            <Label>Seed Type:</Label>
          </LabelsColumn>
          <ValuesColumn>
            <Value>{name}</Value>
            <TypeContainer>
              <IconContainer>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.75 5.25H2.25V12.75H15.75V5.25Z" stroke="#09090B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </IconContainer>
              <Value>{type}</Value>
            </TypeContainer>
            <Value>{tenant}</Value>
            <Value>{purpose}</Value>
            <Value>{location}</Value>
            <StatusBadge>
              <StatusText>{status}</StatusText>
            </StatusBadge>
            <Value>{created}</Value>
            <Value>{lastModified}</Value>
            <Value>{creator}</Value>
            <SeedTypes>{seedTypes}</SeedTypes>
          </ValuesColumn>
        </FieldsContainer>
      </SectionWithBorder>
      
      <Section>
        <SectionTitle>Notes</SectionTitle>
        <Notes>{notes}</Notes>
      </Section>
    </Container>
  );
};

export default ContainerInfo;