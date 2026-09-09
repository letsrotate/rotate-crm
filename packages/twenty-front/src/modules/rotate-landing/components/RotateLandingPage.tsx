import { Trans, useLingui } from '@lingui/react/macro';
import { styled } from '@linaria/react';
import { type FormEvent, type MouseEvent, useState } from 'react';
import { isNonEmptyString } from '@sniptt/guards';

import { ROTATE_BRAND } from '@/rotate-landing/constants/RotateBrand';
import { ROTATE_LINKS } from '@/rotate-landing/constants/RotateLinks';
import { useLastAuthenticatedWorkspaceDomain } from '@/domain-manager/hooks/useLastAuthenticatedWorkspaceDomain';
import { useRotateLandingUrls } from '@/rotate-landing/hooks/useRotateLandingUrls';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';

const StyledPage = styled.div`
  -webkit-font-smoothing: antialiased;
  background: ${ROTATE_BRAND.white};
  color: ${ROTATE_BRAND.ink};
  font-family: ${ROTATE_BRAND.fontSans};
  min-height: 100dvh;
`;

const StyledContainer = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  max-width: 1120px;
  padding: 0 24px;
  width: 100%;
`;

const StyledHeader = styled.header`
  align-items: center;
  display: flex;
  height: 72px;
  justify-content: space-between;
`;

const StyledLogo = styled.img`
  display: block;
  height: 26px;
  width: auto;
`;

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  gap: 8px;
`;

const StyledTextLink = styled.a`
  color: ${ROTATE_BRAND.ink};
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  text-decoration: none;

  &:hover {
    color: ${ROTATE_BRAND.red};
  }
`;

const StyledPrimaryLink = styled.a`
  background: ${ROTATE_BRAND.red};
  border-radius: 8px;
  color: ${ROTATE_BRAND.white};
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  text-decoration: none;
  transition: background 120ms ease;

  &:hover {
    background: ${ROTATE_BRAND.redHover};
  }
`;

const StyledSecondaryLink = styled.a`
  background: ${ROTATE_BRAND.ink};
  border-radius: 8px;
  color: ${ROTATE_BRAND.white};
  font-size: 14px;
  font-weight: 600;
  padding: 10px 16px;
  text-decoration: none;

  &:hover {
    background: ${ROTATE_BRAND.inkHover};
  }
`;

const StyledHero = styled.section`
  display: grid;
  gap: 48px;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  padding: 72px 0 64px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    padding: 40px 0;
  }
`;

const StyledEyebrow = styled.p`
  color: ${ROTATE_BRAND.red};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  margin: 0 0 20px;
  text-transform: uppercase;
`;

const StyledHeadline = styled.h1`
  font-size: clamp(38px, 5.4vw, 60px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.02;
  margin: 0 0 24px;
`;

const StyledLede = styled.p`
  color: ${ROTATE_BRAND.slate};
  font-size: 18px;
  line-height: 1.55;
  margin: 0 0 32px;
  max-width: 34em;
`;

const StyledCtaRow = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const StyledWorkspaceCard = styled.form`
  align-self: start;
  background: ${ROTATE_BRAND.mist};
  border-radius: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px;
`;

const StyledCardTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0;
`;

const StyledCardHint = styled.p`
  color: ${ROTATE_BRAND.slate};
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 8px;
`;

const StyledDomainInput = styled.div`
  align-items: center;
  background: ${ROTATE_BRAND.white};
  border: 1px solid ${ROTATE_BRAND.gray150};
  border-radius: 8px;
  display: flex;
  overflow: hidden;

  &:focus-within {
    border-color: ${ROTATE_BRAND.red};
    box-shadow: 0 0 0 3px ${ROTATE_BRAND.red}4d;
  }
`;

const StyledInput = styled.input`
  background: transparent;
  border: 0;
  color: ${ROTATE_BRAND.ink};
  flex: 1;
  font-family: inherit;
  font-size: 14px;
  min-width: 0;
  outline: none;
  padding: 11px 12px;
`;

const StyledDomainSuffix = styled.span`
  color: ${ROTATE_BRAND.slate};
  font-family: ${ROTATE_BRAND.fontMono};
  font-size: 13px;
  padding: 0 12px 0 0;
  white-space: nowrap;
`;

const StyledSubmitButton = styled.button`
  background: ${ROTATE_BRAND.ink};
  border: 0;
  border-radius: 8px;
  color: ${ROTATE_BRAND.white};
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  padding: 11px 16px;

  &:hover {
    background: ${ROTATE_BRAND.inkHover};
  }
`;

const StyledFeatures = styled.section`
  border-top: 1px solid ${ROTATE_BRAND.gray150};
  display: grid;
  gap: 32px 40px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 56px 0;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFeatureIndex = styled.span`
  color: ${ROTATE_BRAND.red};
  display: block;
  font-family: ${ROTATE_BRAND.fontMono};
  font-size: 12px;
  margin-bottom: 12px;
`;

const StyledFeatureTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0 0 8px;
`;

const StyledFeatureText = styled.p`
  color: ${ROTATE_BRAND.slate};
  font-size: 15px;
  line-height: 1.55;
  margin: 0;
`;

const StyledBand = styled.section`
  background: ${ROTATE_BRAND.ink};
  color: ${ROTATE_BRAND.white};
  padding: 56px 0;
`;

const StyledBandGrid = styled.div`
  display: grid;
  gap: 32px;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const StyledBandTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin: 0;
`;

const StyledBandList = styled.ol`
  color: ${ROTATE_BRAND.gray300};
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  padding-left: 20px;

  strong {
    color: ${ROTATE_BRAND.white};
    font-weight: 600;
  }
`;

const StyledFooter = styled.footer`
  align-items: center;
  color: ${ROTATE_BRAND.slate};
  display: flex;
  flex-wrap: wrap;
  font-size: 13px;
  gap: 16px;
  justify-content: space-between;
  padding: 32px 0;

  a {
    color: ${ROTATE_BRAND.slate};
    text-decoration: none;
  }

  a:hover {
    color: ${ROTATE_BRAND.ink};
  }
`;

const WORKSPACE_SUBDOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,28}[a-z0-9])?$/;

export const RotateLandingPage = () => {
  const { t } = useLingui();
  const { isSingleHostMode, signInUrl, createWorkspaceUrl, workspaceUrl } =
    useRotateLandingUrls();
  const { setLastAuthenticateWorkspaceDomain } =
    useLastAuthenticatedWorkspaceDomain();
  const [workspaceSubdomain, setWorkspaceSubdomain] = useState('');

  const normalizedSubdomain = workspaceSubdomain.trim().toLowerCase();
  const isSubdomainValid = WORKSPACE_SUBDOMAIN_PATTERN.test(normalizedSubdomain);

  // A signed-in visitor is otherwise bounced from the sign-in page back to
  // the workspace they last used (WorkspaceProviderEffect).
  const handleCreateWorkspace = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setLastAuthenticateWorkspaceDomain(null);
    window.location.assign(createWorkspaceUrl);
  };

  const handleOpenWorkspace = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSubdomainValid) {
      return;
    }

    window.location.assign(workspaceUrl(normalizedSubdomain));
  };

  return (
    <StyledPage>
      <PageTitle title={t`Rotate CRM — the CRM for air cargo sales`} />
      <StyledContainer>
        <StyledHeader>
          <a href={ROTATE_LINKS.website} aria-label="Rotate">
            <StyledLogo src="/images/rotate/rotate-logo.svg" alt="Rotate" />
          </a>
          <StyledNav>
            <StyledTextLink href={ROTATE_LINKS.sourceCode}>
              <Trans>Source</Trans>
            </StyledTextLink>
            <StyledTextLink href={ROTATE_LINKS.contact}>
              <Trans>Contact</Trans>
            </StyledTextLink>
            <StyledPrimaryLink href={signInUrl}>
              <Trans>Sign in</Trans>
            </StyledPrimaryLink>
          </StyledNav>
        </StyledHeader>

        <StyledHero>
          <div>
            <StyledEyebrow>
              <Trans>Rotate CRM</Trans>
            </StyledEyebrow>
            <StyledHeadline>
              <Trans>The CRM built for air cargo sales.</Trans>
            </StyledHeadline>
            <StyledLede>
              <Trans>
                Forwarders, stations and lanes as first-class records. Sales
                Cockpit initiatives land in the same place your account
                managers plan visits, log calls and track tonnes. One private
                workspace per airline.
              </Trans>
            </StyledLede>
            <StyledCtaRow>
              <StyledPrimaryLink href={signInUrl}>
                <Trans>Sign in to your workspace</Trans>
              </StyledPrimaryLink>
              <StyledSecondaryLink
                href={createWorkspaceUrl}
                onClick={handleCreateWorkspace}
              >
                <Trans>Create a workspace</Trans>
              </StyledSecondaryLink>
            </StyledCtaRow>
          </div>

          <StyledWorkspaceCard onSubmit={handleOpenWorkspace}>
            <StyledCardTitle>
              <Trans>Already have a workspace?</Trans>
            </StyledCardTitle>
            <StyledCardHint>
              {isSingleHostMode ? (
                <Trans>
                  Every airline has its own workspace. Enter its short name to
                  go straight to it.
                </Trans>
              ) : (
                <Trans>
                  Every airline gets its own subdomain. Enter yours to go
                  straight to it.
                </Trans>
              )}
            </StyledCardHint>
            <StyledDomainInput>
              <StyledInput
                aria-label={
                  isSingleHostMode ? t`Workspace name` : t`Workspace subdomain`
                }
                autoCapitalize="none"
                autoCorrect="off"
                placeholder="airline"
                spellCheck={false}
                value={workspaceSubdomain}
                onChange={(event) => setWorkspaceSubdomain(event.target.value)}
              />
              {!isSingleHostMode && (
                <StyledDomainSuffix>
                  .{window.location.hostname}
                </StyledDomainSuffix>
              )}
            </StyledDomainInput>
            <StyledSubmitButton
              type="submit"
              disabled={!isNonEmptyString(normalizedSubdomain) || !isSubdomainValid}
            >
              <Trans>Open workspace</Trans>
            </StyledSubmitButton>
          </StyledWorkspaceCard>
        </StyledHero>

        <StyledFeatures>
          <div>
            <StyledFeatureIndex>01</StyledFeatureIndex>
            <StyledFeatureTitle>
              <Trans>Cargo-native data model</Trans>
            </StyledFeatureTitle>
            <StyledFeatureText>
              <Trans>
                Forwarders carry their IATA CASS code and segment. Stations and
                origin–destination lanes are objects you can filter, group and
                report on, not free text in a notes field.
              </Trans>
            </StyledFeatureText>
          </div>
          <div>
            <StyledFeatureIndex>02</StyledFeatureIndex>
            <StyledFeatureTitle>
              <Trans>Sales Cockpit inside the CRM</Trans>
            </StyledFeatureTitle>
            <StyledFeatureText>
              <Trans>
                Accepted initiatives sync from the Sales Cockpit with their
                target tonnes, yields and assignee, linked to the forwarder and
                lane they belong to. Follow up from the account, not a
                spreadsheet.
              </Trans>
            </StyledFeatureText>
          </div>
          <div>
            <StyledFeatureIndex>03</StyledFeatureIndex>
            <StyledFeatureTitle>
              <Trans>One workspace per airline</Trans>
            </StyledFeatureTitle>
            <StyledFeatureText>
              <Trans>
                Each carrier runs in its own isolated workspace with its own
                users, roles, API keys and automations, hosted by Rotate in the
                EU on open-source foundations.
              </Trans>
            </StyledFeatureText>
          </div>
        </StyledFeatures>
      </StyledContainer>

      <StyledBand>
        <StyledContainer>
          <StyledBandGrid>
            <StyledBandTitle>
              <Trans>From initiative to booked tonnes, without leaving the account.</Trans>
            </StyledBandTitle>
            <StyledBandList>
              <li>
                <Trans>
                  <strong>Sync.</strong> The Sales Cockpit integration pulls
                  your airline's initiatives and matches them to forwarders by
                  agent name.
                </Trans>
              </li>
              <li>
                <Trans>
                  <strong>Plan.</strong> Account managers see open initiatives
                  on the forwarder record next to contacts, notes and tasks.
                </Trans>
              </li>
              <li>
                <Trans>
                  <strong>Track.</strong> Dashboards roll up target tonnes and
                  weekly revenue by station, lane and initiative type.
                </Trans>
              </li>
            </StyledBandList>
          </StyledBandGrid>
        </StyledContainer>
      </StyledBand>

      <StyledContainer>
        <StyledFooter>
          <span>
            <Trans>© {new Date().getFullYear()} Rotate. Built on Twenty CRM (AGPL-3.0).</Trans>
          </span>
          <span>
            <a href={ROTATE_LINKS.website}>letsrotate.com</a>
            {' · '}
            <a href={ROTATE_LINKS.sourceCode}>
              <Trans>Source code</Trans>
            </a>
            {' · '}
            <a href={signInUrl}>
              <Trans>Sign in</Trans>
            </a>
          </span>
        </StyledFooter>
      </StyledContainer>
    </StyledPage>
  );
};
