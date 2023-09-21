import React, { useCallback, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
  Pagination,
  Chip,
  Card,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
} from "@nextui-org/react";
import type { Selection } from "@nextui-org/react";
import { capitalize, cn } from "../lib/utils";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import type { Timing, Column, Meal, MealContents } from "../data";

const INITIAL_VISIBLE_COLUMNS = [
  "day",
  "breakfast",
  "lunch",
  "snacks",
  "dinner",
];

function splitStringAroundZ(inputString: String) {
  const firstPartIndex = inputString.indexOf("Z");
  const secondPartIndex = inputString.lastIndexOf("Z");

  if (
    firstPartIndex === -1 ||
    secondPartIndex === -1 ||
    firstPartIndex === secondPartIndex
  ) {
    // Return an empty array when 'Z' is not found or found only once.
    return [];
  }

  const firstSection = inputString.slice(0, firstPartIndex);
  const secondSection = inputString.slice(
    firstPartIndex + 1,
    secondPartIndex + 1
  );
  const thirdSection = inputString.slice(secondPartIndex + 1);

  return [firstSection, secondSection, thirdSection];
}

const MainTable = ({
  className,
  meals: users,
  columns,
}: {
  meals: Meal[];
  columns: Column[];
  className?: string;
}) => {
  const [selectedKeys, setSelectedKeys] = useState<React.Key>("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(7);
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];
    const lowerFilterValue = filterValue.toLowerCase();
    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((meal) => {
        const day = meal.day.toLowerCase();
        const breakfast = meal.Breakfast
          ? Object.values(meal.Breakfast).join(", ").toLowerCase()
          : "";
        const lunch = meal.Lunch
          ? Object.values(meal.Lunch).join(", ").toLowerCase()
          : "";
        const snacks = meal.Snacks
          ? Object.values(meal.Snacks).join(", ").toLowerCase()
          : "";
        const dinner = meal.Dinner
          ? Object.values(meal.Dinner).join(", ").toLowerCase()
          : "";

        // Check if any part of the meal matches the filterValue
        return (
          day.includes(lowerFilterValue) ||
          breakfast.includes(lowerFilterValue) ||
          lunch.includes(lowerFilterValue) ||
          snacks.includes(lowerFilterValue) ||
          dinner.includes(lowerFilterValue)
        );
      });
    }
    return filteredUsers;
  }, [users, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const renderCell = React.useCallback((meal: Meal, columnKey: React.Key) => {
    const cellValue = meal[columnKey as keyof Meal];

    switch (columnKey) {
      case "day":
        return <div className="font-semibold">{cellValue as string}</div>;
      case "date":
        return <div className="">{cellValue.toString().slice(0, 10)}</div>;
      default:
        const mealContents = meal[
          capitalize(columnKey.toString()) as keyof Meal
        ] as MealContents;

        return Object.entries(mealContents).map(([key, value]) => (
          <Chip
            variant="dot"
            radius="sm"
            key={key}
            classNames={{
              content: "text-xs truncate max-w-[max(7vw,10rem)]",
              base: "border-none",
            }}>
            {value}
          </Chip>
        ));
    }
  }, []);

  const renderModalData = useCallback(
    (onClose: any, meals: Meal[], selectedKeys: React.Key) => {
      const [keyFirst, keySecond, keyThird] = splitStringAroundZ(
        selectedKeys.toString()
      );

      const meal = meals.find((meal) => meal.date.toString() === keySecond);

      const mealContents = meal
        ? (meal[capitalize(keyThird) as keyof Meal] as MealContents)
        : null;

      console.log(keyFirst, keySecond, keyThird, meals);
      return (
        <>
          <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
          <ModalBody>
            {mealContents &&
              Object.entries(mealContents).map(([key, value]) => (
                <div
                  key={"Snacks"}
                  className="flex flex-col p-2 overflow-hidden line-clamp-1 items-start justify-center">
                  <Chip
                    variant="flat"
                    radius="sm"
                    classNames={{ content: "text-xs" }}>
                    {(capitalize(keyThird), key)}
                  </Chip>
                  <Divider className="my-2" />
                  <div className="text-sm">{value}</div>
                </div>
              ))}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </>
      );
    },
    []
  );

  //   const onNextPage = React.useCallback(() => {
  //     if (page < pages) {
  //       setPage(page + 1);
  //     }
  //   }, [page, pages]);

  //   const onPreviousPage = React.useCallback(() => {
  //     if (page > 1) {
  //       setPage(page - 1);
  //     }
  //   }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}>
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.column)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {users.length} entries
          </span>
          <label className="flex items-center text-default-400 text-small">
            Days:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}>
              <option value="5">Work Days Only</option>
              <option value="7">All Days</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    users.length,
    hasSearchFilter,
  ]);

  //   const bottomContent = React.useMemo(() => {
  //     if (pages > 1) {
  //       return (
  //         <div className="p-2 flex justify-between items-center">
  //           <Pagination
  //             isCompact
  //             showControls
  //             showShadow
  //             color="primary"
  //             page={page}
  //             total={pages}
  //             onChange={setPage}
  //           />
  //           <div className="hidden sm:flex w-[30%] justify-end gap-2">
  //             <Button
  //               isDisabled={pages === 1}
  //               size="sm"
  //               variant="flat"
  //               onPress={onPreviousPage}>
  //               Previous
  //             </Button>
  //             <Button
  //               isDisabled={pages === 1}
  //               size="sm"
  //               variant="flat"
  //               onPress={onNextPage}>
  //               Next
  //             </Button>
  //           </div>
  //         </div>
  //       );
  //     } else {
  //       return <></>;
  //     }
  //   }, [items.length, page, pages, hasSearchFilter]);

  return (
    <>
      <Table
        isStriped
        aria-label="Example table with custom cells, pagination and sorting"
        // bottomContent={bottomContent}
        // bottomContentPlacement="inside"
        classNames={{
          base: cn(className, ""),
          wrapper: "p-0 bg-inherit shadow-none",
        }}
        topContent={topContent}
        topContentPlacement="outside"
        onCellAction={(key: React.Key) => {
          onOpen();
          setSelectedKeys(key);
        }}>
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} className="font-bold">
              {column.column.toLocaleUpperCase()}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No data found"} items={items}>
          {(item) => (
            <TableRow key={item.date.toString()}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey.toString().toLowerCase())}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {isOpen && renderModalData(onClose, items, selectedKeys)}
        </ModalContent>
      </Modal>
    </>
  );
};

type Props = {
  timings: Timing[];
};

const TimingTable = ({ timings }: Props) => {
  const [keys, setKeys] = useState(
    Object.keys(timings[0]).map(function (col) {
      return {
        column: col,
        uid: col.toLowerCase(),
      };
    })
  );

  const renderCell = React.useCallback((item: Timing, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof Timing] as String;
    switch (columnKey) {
      case "day":
        return <div className="font-semibold">{cellValue}</div>;
      default:
        return <div className="">{cellValue}</div>;
    }
  }, []);
  return (
    <Table removeWrapper aria-label="Example static collection table">
      <TableHeader columns={keys}>
        {(column) => (
          <TableColumn key={column.uid} className="font-bold">
            {column.column.toLocaleUpperCase()}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No data found"} items={timings}>
        {(item) => (
          <TableRow key={item.day}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export { MainTable, TimingTable };
