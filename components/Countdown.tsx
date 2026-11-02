import React from "react";

const StyledCard = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-24 w-20 flex-col items-center justify-center rounded-[10px] bg-[#eaf2eb] text-[#174e1e]">
    {children}
  </div>
);

export const countdownRenderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}) => {
  if (completed) {
    // Render a completed state
    return null;
  } else {
    // Render a countdown
    return (
      <div className="flex justify-center gap-2">
        {days !== 0 ? (
          <StyledCard>
            <div className="text-[2.2rem]">{days}</div>
            <div>dager</div>
          </StyledCard>
        ) : null}

        <StyledCard>
          <div className="text-[2.2rem]">{hours}</div>
          <div>timer</div>
        </StyledCard>
        <StyledCard>
          <div className="text-[2.2rem]">{minutes}</div>
          <div>minutter</div>
        </StyledCard>
        {hours === 0 ? (
          <StyledCard>
            <div className="text-[2.2rem]">{seconds}</div>
            <div>sekunder</div>
          </StyledCard>
        ) : null}
      </div>
    );
  }
};
