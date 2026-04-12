import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import JobPostingCard from "../JobPostingCard";
const posting = { _id: "j1", title: "Frontend Dev", author: "TechCorp", location: "Remote", status: "ACTIVE" };
const makeProps = (overrides = {}) => ({
  jobPosting: posting,
  setPostingToClose: jest.fn(),
  xButtonSwitch: jest.fn(),
  setEditJobsInfo: jest.fn(),
  updateStatus: jest.fn(),
  deletePopupSwitch: jest.fn(),
  ...overrides,
});
it("render title, author, and location", () => {
  render(<JobPostingCard {...makeProps()} />);
  expect(screen.getByText("Frontend Dev")).toBeInTheDocument();
  expect(screen.getByText(/TechCorp/)).toBeInTheDocument();
  expect(screen.getByText(/Remote/)).toBeInTheDocument();
});
it("shows the cur status as selected", () => {
  render(<JobPostingCard {...makeProps()} />);
  expect(screen.getByRole("combobox").value).toBe("ACTIVE");
});
it("call setPostingToClos when changed to CLOSED", () => {
  const props = makeProps();
  render(<JobPostingCard {...props} />);
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "CLOSED" } });
  expect(props.setPostingToClose).toHaveBeenCalledWith(posting);
  expect(props.updateStatus).not.toHaveBeenCalled();
});
it("calls updateStatus when changed to a non-CLOSED status", () => {
  const props = makeProps();
  render(<JobPostingCard {...props} />);
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "UNPUBLISHED" } });
  expect(props.updateStatus).toHaveBeenCalledWith("j1", "UNPUBLISHED");
});
it("Edit button calls setEditJobsInfo and xButtonSwitch", () => {
  const props = makeProps();
  render(<JobPostingCard {...props} />);
  fireEvent.click(screen.getByRole("button", { name: /edit/i }));
  expect(props.setEditJobsInfo).toHaveBeenCalledWith(posting);
  expect(props.xButtonSwitch).toHaveBeenCalled();
});
it("Make sure Delete button calls setEditJobsInfo and deletePopupSwitch", () => {
  const props = makeProps();
  render(<JobPostingCard {...props} />);
  fireEvent.click(screen.getByRole("button", { name: /delete/i }));
  expect(props.setEditJobsInfo).toHaveBeenCalledWith(posting);
  expect(props.deletePopupSwitch).toHaveBeenCalled();
});