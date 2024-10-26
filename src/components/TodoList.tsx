import React, { useState, KeyboardEvent, useEffect, useCallback } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, Trash2, Edit2, Check, Undo2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Progress } from "../components/ui/progress";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import "./TodoList.css";
import sampleData from "../sampleData.json";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useNavigate } from "react-router-dom";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  type: "todo" | "section";
}

const CompletedPanel: React.FC<{
  completedTodos: Todo[];
  onRestore: (id: number) => void;
  isMobile: boolean;
  targetTasks: number;
  onTargetTasksChange: (value: number) => void;
  onSaveRecap: (recap: string) => void;
}> = ({
  completedTodos,
  onRestore,
  isMobile,
  targetTasks,
  onTargetTasksChange,
  onSaveRecap,
}) => {
  const { t } = useTranslation();
  const progressValue =
    Math.min(completedTodos.length, targetTasks) * (100 / targetTasks);
  const isCompleted = completedTodos.length >= targetTasks;
  const [recap, setRecap] = useState("");

  useEffect(() => {
    setRecap(completedTodos.map((todo) => `- ${todo.text}`).join("\n"));
  }, [completedTodos]);

  const saveRecap = () => {
    onSaveRecap(recap);
  };

  return (
    <Card className="w-full lg:max-w-md shadow-sm rounded-xl">
      <CardHeader>
        <CardTitle className="mb-4">{t("whatIveDoneToday")}</CardTitle>
        <Progress
          value={progressValue}
          className={`w-full h-2 mt-2 ${isCompleted ? "bg-primary" : ""}`}
        />
        <p className="text-sm text-muted-foreground pt-2 flex items-center justify-center">
          {t("tasksCompleted", { count: completedTodos.length })} /
          <Select onValueChange={(value) => onTargetTasksChange(Number(value))}>
            <SelectTrigger className="w-[60px] h-6 text-sm ml-1 mr-1">
              <SelectValue placeholder={targetTasks.toString()} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 20, 25, 30].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {t("targetTasks")}
        </p>
      </CardHeader>
      <CardContent>
        <Droppable droppableId="completed">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2 pl-4"
            >
              {completedTodos.map((todo, index) => (
                <Draggable
                  key={todo.id}
                  draggableId={todo.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center justify-between p-2 pl-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <Check size={20} className="text-gray-300 mr-2" />
                        <span className="text-sm line-through truncate">
                          {todo.text}
                        </span>
                      </div>
                      {isMobile ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRestore(todo.id)}
                        >
                          <Undo2 size={16} />
                        </Button>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onRestore(todo.id)}
                            >
                              <Undo2 size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("restore")}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>

        {/* 今日recap 功能 */}

        <Dialog>
          <DialogTrigger asChild>
            <div className="flex justify-center ml-4">
              <Button className="w-full mt-4 h-12 font-bold">
                {t("todaysRecap")}
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] p-8">
            <DialogHeader>
              <DialogTitle className="mb-1 text-xl">
                {t("todaysRecap")}
              </DialogTitle>
              <DialogDescription>{t("recapDescription")}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-0">
              <Textarea
                value={recap}
                onChange={(e) => setRecap(e.target.value)}
                className="h-[200px]"
              />
              <Button
                onClick={saveRecap}
                className="w-full h-12 font-bold"
                id="saveRecapBtn"
              >
                {t("saveRecap")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 今日recap 功能結束 */}
      </CardContent>
    </Card>
  );
};

export function TodoList() {
  const { t } = useTranslation();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [titleText, setTitleText] = useState("");
  const fullTitle = t("whatDoYouWantToGetDoneToday");
  const [shouldResetTitle, setShouldResetTitle] = useState(false);
  const [transitioning, setTransitioning] = useState<number | null>(null);
  const [targetTasks, setTargetTasks] = useState(10);
  const navigate = useNavigate();

  const isMobile = window.innerWidth < 768; // 簡單的移動設備檢測

  const startTitleAnimation = useCallback(() => {
    let index = 0;
    setTitleText("");
    const intervalId = setInterval(() => {
      setTitleText((prev) => fullTitle.slice(0, prev.length + 1));
      index++;
      if (index >= fullTitle.length) {
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [fullTitle]);

  useEffect(() => {
    const cleanup = startTitleAnimation();
    return cleanup;
  }, [startTitleAnimation, shouldResetTitle]);

  useEffect(() => {
    const addDataBtn = document.getElementById("addDataBtn");
    const resetBtn = document.getElementById("resetBtn");

    const addSampleData = () => {
      setTodos((prevTodos) => [...prevTodos, ...(sampleData.todos as Todo[])]);
      setCompletedTodos((prevCompleted) => [
        ...prevCompleted,
        ...(sampleData.completedTodos as Todo[]),
      ]);
    };

    const resetApp = () => {
      setTodos([]);
      setCompletedTodos([]);
      setNewTodo("");
      setEditingId(null);
      setEditText("");
      setShouldResetTitle((prev) => !prev); // 觸發標題動畫重置
    };

    addDataBtn?.addEventListener("click", addSampleData);
    resetBtn?.addEventListener("click", resetApp);

    return () => {
      addDataBtn?.removeEventListener("click", addSampleData);
      resetBtn?.removeEventListener("click", resetApp);
    };
  }, []);

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([
        ...todos,
        { id: Date.now(), text: newTodo, completed: false, type: "todo" },
      ]);
      setNewTodo("");
    }
  };

  const addSection = () => {
    const newSection: Todo = {
      id: Date.now(),
      text: t("newSection"),
      completed: false,
      type: "section",
    };
    setTodos([...todos, newSection]);
    startEditing(newSection.id, newSection.text, {} as React.MouseEvent);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTodo.trim() !== "") {
      addTodo();
    }
  };

  const toggleTodo = (id: number) => {
    const todoToToggle = todos.find((todo) => todo.id === id);
    if (todoToToggle && !todoToToggle.completed) {
      setTransitioning(id);
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: true } : todo
        )
      );

      setTimeout(() => {
        setCompletedTodos([
          ...completedTodos,
          { ...todoToToggle, completed: true },
        ]);
        setTodos(todos.filter((todo) => todo.id !== id));
        setTransitioning(null);
      }, 300);
    } else if (todoToToggle) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (id: number, text: string, event: React.MouseEvent) => {
    // 防觸發 checkbox 的點擊事件
    event.stopPropagation();
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id: number) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: editText } : todo))
    );
    setEditingId(null);
  };

  const handleEditKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.key === "Enter") {
      saveEdit(id);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      // 在同一列表內移動
      const items = Array.from(
        source.droppableId === "todos" ? todos : completedTodos
      );
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      if (source.droppableId === "todos") {
        setTodos(items);
      } else {
        setCompletedTodos(items);
      }
    } else {
      // 在列表之間移動
      const sourceItems = Array.from(
        source.droppableId === "todos" ? todos : completedTodos
      );
      const destItems = Array.from(
        destination.droppableId === "todos" ? todos : completedTodos
      );
      const [movedItem] = sourceItems.splice(source.index, 1);

      if (destination.droppableId === "completed") {
        movedItem.completed = true;
      } else {
        movedItem.completed = false;
      }

      destItems.splice(destination.index, 0, movedItem);

      if (source.droppableId === "todos") {
        setTodos(sourceItems);
        setCompletedTodos(destItems);
      } else {
        setCompletedTodos(sourceItems);
        setTodos(destItems);
      }
    }
  };

  const restoreTodo = (id: number) => {
    const todoToRestore = completedTodos.find((todo) => todo.id === id);
    if (todoToRestore) {
      setTodos([...todos, { ...todoToRestore, completed: false }]);
      setCompletedTodos(completedTodos.filter((todo) => todo.id !== id));
    }
  };

  const handleSaveRecap = (recap: string) => {
    // 使用 encodeURIComponent 來確保 URL 安全
    navigate(`/daily-review?recap=${encodeURIComponent(recap)}`);
  };

  return (
    <TooltipProvider>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row justify-center lg:space-x-4 w-full max-w-5xl mx-auto px-4 lg:px-0">
          <Card className="w-full lg:max-w-xl mb-4 lg:mb-0 shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="typewriter-title">
                {titleText}
                <span className="caret"></span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-4">
                <Input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("addTodoPlaceholder")}
                  className="flex-grow text-md h-14 ml-7 transition-all duration-200 border-2 hover:border-gray-600 dark:hover:border-gray-500 hover:border-2 focus:border-2 focus:border-primary rounded-lg"
                />
                <Button
                  onClick={addTodo}
                  disabled={newTodo.trim() === ""}
                  className="h-14 w-32 font-bold rounded-lg"
                >
                  {t("addTodo")}
                </Button>
              </div>
              <Droppable droppableId="todos">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {todos.map((todo, index) => (
                      <Draggable
                        key={todo.id}
                        draggableId={todo.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <React.Fragment>
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center group ${
                                snapshot.isDragging ? "opacity-70" : ""
                              } ${
                                transitioning === todo.id
                                  ? "opacity-70 transition-all duration-300"
                                  : ""
                              }`}
                            >
                              <span
                                {...provided.dragHandleProps}
                                className={`mr-2 cursor-move text-gray-300 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 ${
                                  isMobile
                                    ? ""
                                    : "opacity-0 group-hover:opacity-100"
                                }`}
                              >
                                <GripVertical size={20} />
                              </span>
                              <div
                                className={`flex items-center justify-between p-2 rounded-lg border bg-card text-card-foreground shadow-sm flex-grow ${
                                  todo.type === "section"
                                    ? "bg-secondary border-secondary h-12"
                                    : ""
                                } ${
                                  snapshot.isDragging ? "rotate-1" : ""
                                } hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200`}
                              >
                                <div className="flex items-center flex-grow">
                                  {todo.type === "todo" && (
                                    <Checkbox
                                      checked={todo.completed}
                                      onCheckedChange={() =>
                                        toggleTodo(todo.id)
                                      }
                                      className="mr-3 ml-3"
                                    />
                                  )}
                                  {editingId === todo.id ? (
                                    <Input
                                      value={editText}
                                      onChange={(e) =>
                                        setEditText(e.target.value)
                                      }
                                      onKeyDown={(e) =>
                                        handleEditKeyDown(e, todo.id)
                                      }
                                      onBlur={() => saveEdit(todo.id)}
                                      autoFocus
                                      className="flex-grow mr-2 h-8"
                                    />
                                  ) : (
                                    <span
                                      className={`${
                                        todo.completed
                                          ? "line-through text-muted-foreground"
                                          : ""
                                      } text-sm flex-grow text-left ${
                                        todo.type === "section"
                                          ? "font-bold text-sm pl-2"
                                          : ""
                                      } cursor-pointer`}
                                      onClick={(e) =>
                                        startEditing(todo.id, todo.text, e)
                                      }
                                    >
                                      {todo.text}
                                    </span>
                                  )}
                                </div>
                                <div
                                  className={`flex space-x-1 ml-2 ${
                                    editingId === todo.id
                                      ? ""
                                      : "opacity-0 group-hover:opacity-100"
                                  } transition-opacity duration-200`}
                                >
                                  {editingId === todo.id ? (
                                    isMobile ? (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => saveEdit(todo.id)}
                                      >
                                        <Check size={16} />
                                      </Button>
                                    ) : (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => saveEdit(todo.id)}
                                          >
                                            <Check size={16} />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{t("save")}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    )
                                  ) : (
                                    <>
                                      {isMobile ? (
                                        <>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) =>
                                              startEditing(
                                                todo.id,
                                                todo.text,
                                                e
                                              )
                                            }
                                          >
                                            <Edit2 size={16} />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteTodo(todo.id)}
                                          >
                                            <Trash2 size={16} />
                                          </Button>
                                        </>
                                      ) : (
                                        <>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) =>
                                                  startEditing(
                                                    todo.id,
                                                    todo.text,
                                                    e
                                                  )
                                                }
                                              >
                                                <Edit2 size={16} />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>{t("edit")}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                  deleteTodo(todo.id)
                                                }
                                              >
                                                <Trash2 size={16} />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>{t("delete")}</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </li>
                            {snapshot.isDragging && (
                              <li className="h-[52px] ml-8 bg-gray-100 dark:bg-gray-800 rounded-md my-2 transition-all duration-200"></li>
                            )}
                          </React.Fragment>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
              {todos.length > 0 && (
                <div className="ml-7">
                  <Button
                    variant="ghost"
                    className="w-full mt-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={addSection}
                  >
                    + {t("addSection")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          {completedTodos.length > 0 && (
            <CompletedPanel
              completedTodos={completedTodos}
              onRestore={restoreTodo}
              isMobile={isMobile}
              targetTasks={targetTasks}
              onTargetTasksChange={setTargetTasks}
              onSaveRecap={handleSaveRecap}
            />
          )}
        </div>
      </DragDropContext>
    </TooltipProvider>
  );
}
