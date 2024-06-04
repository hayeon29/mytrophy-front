import React from 'react';
import { Card, CardHeader, CardBody, Divider } from '@nextui-org/react';

export default function Dashboard() {
  return (
    <div className="m-4">
      <div className="m-4">
        <p className="text-2xl">Dashboard</p>
      </div>
      <div className="flex flex-wrap gap-4 justify-between">
        <Card className="w-[200px] m-1">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-small text-danger">방문자 수</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-2xl text-danger">3</p>
          </CardBody>
        </Card>
        <Card className="w-[200px] m-1">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-small text-warning">회원 수</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-2xl text-warning">3</p>
          </CardBody>
        </Card>
        <Card className="w-[200px] m-1">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-small text-success">게시물 수</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-2xl text-success">3</p>
          </CardBody>
        </Card>
        <Card className="w-[200px] m-1">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-small text-primary">게임 수</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-2xl text-primary">3</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
